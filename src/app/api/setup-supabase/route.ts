import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/infrastructure/supabase/client';
import { seedSupabaseData } from '@/infrastructure/supabase/seed';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.'
      }, { status: 500 });
    }

    const { action } = await request.json();

    switch (action) {
      case 'check-connection':
        // Test basic connection
        const { error: connectionError } = await supabaseAdmin
          .from('users')
          .select('count')
          .limit(1);
        
        if (connectionError && connectionError.code === 'PGRST116') {
          return NextResponse.json({
            success: false,
            error: 'Tables do not exist. Please run migrations first.',
            needsMigration: true
          });
        }

        if (connectionError) {
          return NextResponse.json({
            success: false,
            error: `Connection failed: ${connectionError.message}`
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Connection successful',
          tablesExist: true
        });

      case 'seed-data':
        // Seed the database with example data
        console.log('🌱 Starting database seeding...');
        const seedResult = await seedSupabaseData();
        
        return NextResponse.json({
          success: true,
          message: 'Database seeded successfully!',
          data: {
            usersCreated: seedResult.users?.length || 0,
            accountsCreated: seedResult.accounts?.length || 0,
            transactionsCreated: seedResult.transactions?.length || 0,
            assetsCreated: seedResult.assets?.length || 0,
            liabilitiesCreated: seedResult.liabilities?.length || 0,
            budgetsCreated: seedResult.budgets?.length || 0,
            cyclesCreated: seedResult.cycles?.length || 0,
          }
        });

      case 'reset-data':
        // Clear all data from tables
        console.log('🗑️ Resetting database...');
        
        const tables = ['cycles', 'budgets', 'liabilities', 'assets', 'transactions', 'accounts', 'users'] as const;
        
        for (const table of tables) {
          const { error } = await supabaseAdmin.from(table).delete().neq('id', 0);
          if (error) {
            console.error(`Error clearing ${table}:`, error);
          }
        }

        return NextResponse.json({
          success: true,
          message: 'Database reset successfully!'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: check-connection, seed-data, or reset-data'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Setup API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Setup API',
    availableActions: [
      'POST with action: check-connection',
      'POST with action: seed-data', 
      'POST with action: reset-data'
    ]
  });
}
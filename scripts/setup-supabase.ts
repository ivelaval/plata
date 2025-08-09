#!/usr/bin/env tsx

/**
 * Supabase Setup Script
 * 
 * This script helps set up Supabase for the Plata finance application.
 * It creates the database schema and seeds initial data.
 */

import { supabaseAdmin } from '@/infrastructure/supabase/client';
import { seedSupabaseData } from '@/infrastructure/supabase/seed';

async function setupSupabase() {
  console.log('🚀 Starting Supabase setup...');

  if (!supabaseAdmin) {
    console.error('❌ Supabase admin client not available.');
    console.log('Please ensure you have set the following environment variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  try {
    // Test connection
    console.log('🔍 Testing Supabase connection...');
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .single();
    
    if (error && error.code === 'PGRST116') {
      console.log('⚠️  Tables do not exist. Please run the migration SQL first.');
      console.log('   Copy the contents of supabase/migrations/001_initial_schema.sql');
      console.log('   and run it in your Supabase SQL editor.');
      process.exit(1);
    }

    if (error) {
      throw error;
    }

    console.log('✅ Supabase connection successful!');

    // Seed data
    console.log('🌱 Seeding data...');
    await seedSupabaseData();

    console.log('🎉 Supabase setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Start your development server: npm run dev');
    console.log('  2. Visit http://localhost:3000/test-supabase to test the integration');
    console.log('  3. Update your dashboard to use SupabaseUserRepository instead of MockUserRepository');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupSupabase();
}

export { setupSupabase };
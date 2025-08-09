'use client';

import { useState } from 'react';

interface SeedData {
  usersCreated: number;
  accountsCreated: number;
  transactionsCreated: number;
  assetsCreated: number;
  liabilitiesCreated: number;
  budgetsCreated: number;
  cyclesCreated: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  needsMigration?: boolean;
  tablesExist?: boolean;
  data?: SeedData;
}

export default function SetupSupabasePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, ApiResponse>>({});

  const callApi = async (action: string) => {
    setLoading(action);
    try {
      const response = await fetch('/api/setup-supabase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const result = await response.json();
      setResults(prev => ({ ...prev, [action]: result }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [action]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Network error' 
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  const ResultCard = ({ action, result }: { action: string, result?: ApiResponse }) => (
    <div className={`p-4 rounded-lg border ${result?.success ? 'bg-green-50 border-green-200' : result?.error ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
      <h3 className="font-semibold mb-2 capitalize">{action.replace('-', ' ')}</h3>
      {result ? (
        <div>
          <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
            {result.success ? '✅' : '❌'} {result.message || result.error}
          </p>
          {result.data && (
            <div className="mt-2 text-xs text-gray-600">
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
          {result.needsMigration && (
            <div className="mt-2 p-2 bg-yellow-100 rounded text-sm">
              <p className="font-semibold text-yellow-800">⚠️ Migración Requerida</p>
              <p className="text-yellow-700">Necesitas ejecutar las migraciones SQL primero.</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No ejecutado aún</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🚀 Configuración de Supabase
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Pasos para configurar Supabase:</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Crea un proyecto en <a href="https://supabase.com" className="underline" target="_blank">supabase.com</a></li>
            <li>Configura las variables de entorno en <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
            <li>Ejecuta las migraciones SQL en el SQL Editor de Supabase</li>
            <li>Usa los botones de abajo para probar y poblar la base de datos</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => callApi('check-connection')}
            disabled={loading === 'check-connection'}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {loading === 'check-connection' ? '🔄 Verificando...' : '🔍 Verificar Conexión'}
          </button>

          <button
            onClick={() => callApi('seed-data')}
            disabled={loading === 'seed-data'}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {loading === 'seed-data' ? '🌱 Poblando...' : '🌱 Poblar Datos'}
          </button>

          <button
            onClick={() => callApi('reset-data')}
            disabled={loading === 'reset-data'}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-4 py-3 rounded-lg font-medium transition-colors"
          >
            {loading === 'reset-data' ? '🗑️ Limpiando...' : '🗑️ Limpiar Datos'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ResultCard action="check-connection" result={results['check-connection']} />
          <ResultCard action="seed-data" result={results['seed-data']} />
          <ResultCard action="reset-data" result={results['reset-data']} />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">📋 Migración SQL Requerida</h3>
          <p className="text-yellow-800 mb-3">
            Copia y pega este SQL en el SQL Editor de tu proyecto Supabase:
          </p>
          <div className="bg-yellow-100 p-3 rounded text-sm overflow-auto">
            <p className="font-mono text-xs text-yellow-700">
              Archivo: <code>supabase/migrations/001_initial_schema.sql</code>
            </p>
            <p className="text-yellow-600 mt-1">
              Ve a tu proyecto Supabase → SQL Editor → pega el contenido del archivo → ejecuta
            </p>
          </div>
        </div>

        <div className="mt-8 bg-gray-100 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🛠️ Variables de Entorno</h3>
          <p className="text-gray-700 mb-3">
            Asegúrate de tener estas variables en tu archivo <code className="bg-gray-200 px-1 rounded">.env.local</code>:
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm overflow-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key`}
          </pre>
        </div>
      </div>
    </div>
  );
}
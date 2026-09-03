import fs from 'node:fs';

const required = [
  'src/App.jsx',
  'src/components/Header.jsx',
  'src/components/EnvironmentGuard.jsx',
  'src/components/ErrorBoundary.jsx',
  'SECURITY_RLS_POLICIES_V24_1.sql',
  'SUPABASE_SCHEMA.sql',
  'vite.config.js',
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDeps = Object.values({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) });
if (allDeps.some((value) => String(value).includes('latest'))) {
  console.error('package.json still contains latest dependency ranges.');
  process.exit(1);
}

const schema = fs.readFileSync('SUPABASE_SCHEMA.sql', 'utf8');
if (!schema.includes('create table if not exists public.places')) {
  console.error('SUPABASE_SCHEMA.sql missing places table.');
  process.exit(1);
}

const app = fs.readFileSync('src/App.jsx', 'utf8');
const firstReturn = app.indexOf('if (error)');
const authHook = app.indexOf('const auth = useAuth()');
if (authHook > firstReturn) {
  console.error('useAuth appears after conditional return. Rules of Hooks risk remains.');
  process.exit(1);
}

console.log('V24.1 smoke test passed.');

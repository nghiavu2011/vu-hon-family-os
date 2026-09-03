export const runtimeConfig = {
  appEnv: import.meta.env.VITE_APP_ENV || 'local',
  dataMode: import.meta.env.VITE_DATA_MODE || 'static',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  enableDemoRoleSwitcher: import.meta.env.VITE_ENABLE_DEMO_ROLE_SWITCHER !== 'false',
};

export function isSupabaseMode() {
  return runtimeConfig.dataMode === 'supabase'
    && Boolean(runtimeConfig.supabaseUrl)
    && Boolean(runtimeConfig.supabaseAnonKey);
}

export function isProductionEnv() {
  return runtimeConfig.appEnv === 'production';
}

export function isDemoRoleSwitcherAllowed() {
  return !isProductionEnv() && runtimeConfig.enableDemoRoleSwitcher;
}

export function getEnvironmentWarnings() {
  const warnings = [];

  if (isProductionEnv() && runtimeConfig.dataMode !== 'supabase') {
    warnings.push('Production env không được chạy static data nếu có dữ liệu gia đình thật.');
  }

  if (isProductionEnv() && isDemoRoleSwitcherAllowed()) {
    warnings.push('Production env không được bật demo role switcher.');
  }

  if (runtimeConfig.dataMode === 'supabase' && !isSupabaseMode()) {
    warnings.push('VITE_DATA_MODE=supabase nhưng thiếu Supabase URL/key.');
  }

  return warnings;
}

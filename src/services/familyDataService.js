import { isSupabaseMode, runtimeConfig } from '../runtimeConfig.js';
import { loadStaticFamilyData } from './staticDataService.js';
import { loadSupabaseFamilyData } from './supabaseDataService.js';

export async function loadFamilyData() {
  if (isSupabaseMode()) return loadSupabaseFamilyData();
  const data = await loadStaticFamilyData();
  if (runtimeConfig.dataMode === 'supabase' && !isSupabaseMode()) {
    return { ...data, warning: 'Dang de Supabase mode nhung thieu URL/key, tam fallback sang static-json.' };
  }
  return data;
}

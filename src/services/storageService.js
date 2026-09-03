
import { isSupabaseMode } from '../runtimeConfig.js';
import { getSupabaseClient } from './supabaseClient.js';

export function createLocalPreview(file) {
  if (!file) return null;
  return URL.createObjectURL(file);
}

export async function uploadGravePhoto({ file, graveId, personId }) {
  if (!file) throw new Error('Chưa chọn file ảnh.');

  if (!isSupabaseMode()) {
    return {
      mode: 'static-preview',
      url: createLocalPreview(file),
      fileName: file.name,
      note: 'Static mode chỉ tạo preview local, không upload thật.',
    };
  }

  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase chưa được cấu hình.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `grave-photos/${graveId || personId || 'unknown'}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from('family-assets')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data } = client.storage
    .from('family-assets')
    .getPublicUrl(path);

  return {
    mode: 'supabase-storage',
    path,
    url: data.publicUrl,
    fileName: file.name,
  };
}

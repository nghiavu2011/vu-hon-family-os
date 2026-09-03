import { getSupabaseClient } from './supabaseClient.js';
export async function submitGraveLocation(payload){ const c=getSupabaseClient(); if(!c) throw new Error('Can Supabase mode.'); const {data,error}=await c.from('family_requests').insert({request_type:'grave_location_update',message:JSON.stringify(payload),status:'pending'}).select().single(); if(error) throw error; return data; }

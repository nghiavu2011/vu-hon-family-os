
import { isSupabaseMode } from '../runtimeConfig.js';
import { getSupabaseClient } from './supabaseClient.js';
import { exportPatch } from '../lib/adminPatch.js';

function requireSupabaseClient() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Chức năng này cần Supabase mode.');
  return client;
}

export async function submitContactRequest(form, actor) {
  const payload = {
    request_type: 'contact_request',
    from_person_id: form.fromPersonId || null,
    to_person_id: form.toPersonId || null,
    message: form.message,
    status: 'pending',
    contact_channel_requested: form.channel || 'unspecified',
    reason: form.reason || null,
  };

  if (!isSupabaseMode()) {
    return exportPatch('contact-request', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('family_requests')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveContactProfileDraft(form, actor) {
  const payload = {
    person_id: form.personId || null,
    phone: form.phone || null,
    zalo: form.zalo || null,
    facebook: form.facebook || null,
    linkedin: form.linkedin || null,
    email: form.email || null,
    city: form.city || null,
    country: form.country || 'Việt Nam',
    phone_visibility: form.phoneVisibility || 'private',
    social_visibility: form.socialVisibility || 'family',
    email_visibility: form.emailVisibility || 'private',
    allow_contact_request: Boolean(form.allowContactRequest),
    consent_at: form.consent ? new Date().toISOString() : null,
  };

  if (!isSupabaseMode()) {
    return exportPatch('contact-profile-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('contact_profiles')
    .upsert(payload, { onConflict: 'person_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveCareerProfileDraft(form, actor) {
  const payload = {
    person_id: form.personId || null,
    industry: form.industry || null,
    occupation: form.occupation || null,
    company: form.company || null,
    city: form.city || null,
    country: form.country || 'Việt Nam',
    skills: form.skills ? form.skills.split(',').map((item) => item.trim()).filter(Boolean) : [],
    education: form.education || null,
    can_mentor: Boolean(form.canMentor),
    can_offer_internship: Boolean(form.canOfferInternship),
    can_review_cv: Boolean(form.canReviewCv),
    can_refer_job: Boolean(form.canReferJob),
    public_bio: form.publicBio || null,
    visibility: form.visibility || 'family',
  };

  if (!isSupabaseMode()) {
    return exportPatch('career-profile-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('career_profiles')
    .upsert(payload, { onConflict: 'person_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitMentorshipRequest(form, actor) {
  const payload = {
    request_type: 'mentorship_request',
    from_person_id: form.fromPersonId || null,
    to_person_id: form.toPersonId || null,
    message: JSON.stringify({
      topic: form.topic,
      goal: form.goal,
      studentInfo: form.studentInfo,
      preferredContact: form.preferredContact,
    }),
    status: 'pending',
  };

  if (!isSupabaseMode()) {
    return exportPatch('mentorship-request', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('family_requests')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveYoungProfileDraft(form, actor) {
  const payload = {
    person_id: form.personId || null,
    school: form.school || null,
    class_name: form.className || null,
    strengths: form.strengths || null,
    interests: form.interests || null,
    target_major: form.targetMajor || null,
    support_needed: form.supportNeeded || null,
    portfolio_url: form.portfolioUrl || null,
    visibility: form.visibility || 'family',
    status: 'needs_review',
  };

  if (!isSupabaseMode()) {
    return exportPatch('young-profile-draft', payload, actor);
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('young_generation_profiles')
    .upsert(payload, { onConflict: 'person_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

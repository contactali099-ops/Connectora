/**
 * Supabase-Ready Client Configuration
 *
 * Reads only browser-safe public environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 *
 * Never place SUPABASE_SERVICE_ROLE_KEY in frontend code.
 */

export interface SupabaseConfigStatus {
  configured: boolean;
  urlPresent: boolean;
  anonKeyPresent: boolean;
  modeLabel: string;
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function isRealValue(val: string | undefined, placeholderPrefix: string): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  if (!trimmed) return false;
  if (trimmed.includes('your-project-id') || trimmed.includes(placeholderPrefix)) return false;
  return true;
}

export function isSupabaseConfigured(): boolean {
  return (
    isRealValue(rawUrl, 'your-project-id') &&
    isRealValue(rawAnonKey, 'your-public-supabase')
  );
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  const urlPresent = isRealValue(rawUrl, 'your-project-id');
  const anonKeyPresent = isRealValue(rawAnonKey, 'your-public-supabase');
  const configured = urlPresent && anonKeyPresent;

  return {
    configured,
    urlPresent,
    anonKeyPresent,
    modeLabel: configured
      ? 'Supabase Environment Configured'
      : 'Interactive Demo Preview (Connect Supabase for Live Persistence)',
  };
}

export const SUPABASE_ENDPOINTS = {
  url: rawUrl ?? '',
  anonKey: rawAnonKey ?? '',
};

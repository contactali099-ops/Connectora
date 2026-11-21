import { Info } from 'lucide-react';
import { getSupabaseStatus } from '../lib/supabase';

interface PreviewModeBannerProps {
  contextNote: string;
}

export function PreviewModeBanner({ contextNote }: PreviewModeBannerProps) {
  const status = getSupabaseStatus();

  if (status.configured) {
    return null;
  }

  return (
    <div className="bg-[#EEE9FF]/70 border border-[#D9CEF9] rounded-xl px-4 py-3 flex items-start gap-3 text-sm text-[#17243A]">
      <Info className="w-4 h-4 text-[#7256D9] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-0.5">
        <p className="font-semibold text-[#17243A]">Interactive Demo Preview</p>
        <p className="text-xs sm:text-sm text-[#20243A]/85">{contextNote}</p>
      </div>
    </div>
  );
}

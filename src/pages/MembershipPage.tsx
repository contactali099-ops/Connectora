import { Check, Lock } from 'lucide-react';
import { AppRoute } from '../types/platform';

interface MembershipPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function MembershipPage({ onNavigate }: MembershipPageProps) {
  const freeFeatures = [
    'Create a complete 18+ adult profile',
    'Upload and manage profile photos',
    'Discover adult members across Friendship, Social & Relationship categories',
    'Filter by country, adult age range, interests, languages, and intentions',
    'Send likes and receive mutual matches',
    'Private messaging with mutual matches',
    'Full access to Block, Unmatch, and Safety Reporting tools',
  ];

  const futureFeatures = [
    'Advanced compatibility filters (planned post-launch)',
    'Extended travel & cross-border discovery controls (Canada & UK rollout)',
    'Priority profile visibility options (disabled until billing & legal review)',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold text-[#7256D9]">Launch Membership (USD)</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#17243A] [text-wrap:balance]">
          Launching free for every verified adult member.
        </h1>
        <p className="text-base text-[#74798A] leading-relaxed">
          Connectora launches with a full-featured Free Membership in the United States. Paid
          subscriptions are intentionally disabled until live backend verification, legal compliance,
          and payment infrastructure are finalized.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Active Launch Plan */}
        <div className="bg-white border-2 border-[#7256D9] rounded-2xl p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#7256D9]">Active Launch Plan</span>
              <span className="text-xs text-[#74798A]">Currency: USD</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#17243A]">
                Free Community Membership
              </h2>
              <p className="mt-2 font-display text-4xl font-bold text-[#17243A] tabular-nums">
                $0 <span className="text-sm font-normal text-[#74798A]">/ month</span>
              </p>
            </div>
            <ul className="space-y-3 pt-2 border-t border-[#E4E6F0]">
              {freeFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-[#20243A]">
                  <Check className="w-4 h-4 text-[#7256D9] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="w-full min-h-[46px] px-5 py-3 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl transition-colors cursor-pointer"
          >
            Join Connectora — It&apos;s Free
          </button>
        </div>

        {/* Future-Ready Disabled Plan */}
        <div className="bg-[#F4F5F8] border border-[#E4E6F0] rounded-2xl p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#74798A]">Future Roadmap</span>
              <span className="text-xs font-medium text-[#74798A] inline-flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Payments Disabled
              </span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#17243A]">
                Connectora Plus (Planned)
              </h2>
              <p className="mt-2 text-sm text-[#74798A]">
                Pricing in USD, CAD, and GBP will be announced only after full legal and payment
                integration. No payments are collected during launch.
              </p>
            </div>
            <ul className="space-y-3 pt-2 border-t border-[#E4E6F0]">
              {futureFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-sm text-[#74798A]">
                  <Lock className="w-4 h-4 text-[#74798A] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            disabled
            aria-disabled="true"
            className="w-full min-h-[46px] px-5 py-3 text-sm font-semibold text-[#74798A] bg-[#E4E6F0] rounded-xl cursor-not-allowed"
          >
            Not Available During Free Launch
          </button>
        </div>
      </div>
    </div>
  );
}

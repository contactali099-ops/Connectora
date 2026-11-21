import { useState } from 'react';
import { ChevronDown, Globe, ShieldCheck } from 'lucide-react';
import { AppRoute } from '../types/platform';
import { COUNTRY_LIST } from '../data/countries';

interface AboutFaqPageProps {
  onNavigate: (route: AppRoute) => void;
}

const FAQS = [
  {
    q: 'Is Connectora free?',
    a: 'Yes. Connectora launches with a free membership model covering profile creation, photo uploads, member discovery, basic filters, likes, mutual matches, private messaging, and safety tools. Paid plans are disabled at launch.',
  },
  {
    q: 'Who can join?',
    a: 'Adults aged 18 and older who agree to our Community Guidelines and Terms of Service. Our primary launch market is the United States, with international support engineered for Canada and the United Kingdom.',
  },
  {
    q: 'Is the platform 18+?',
    a: 'Strictly yes. Connectora is exclusively for adults aged 18+. Underage registration is blocked during signup through date-of-birth enforcement and age-assurance confirmation, and any suspected underage account can be reported immediately.',
  },
  {
    q: 'How do matches work?',
    a: 'A match is created only when two adults mutually like each other. Once a mutual match exists, a private conversation opens between the two matched accounts.',
  },
  {
    q: 'How do I report someone?',
    a: 'You can report any profile directly from the Profile Detail modal, from inside a conversation header, or through the Safety Center report form. Every report creates a private record visible only to authorized moderators.',
  },
  {
    q: 'How do I block someone?',
    a: 'Click "Block" on any member profile or inside a message thread. Blocking immediately hides both accounts from each other in discovery and prevents any further likes or messages.',
  },
  {
    q: 'How can I delete my account?',
    a: 'Open Profile & Settings while signed in and scroll to Account Management. Confirming deletion removes your profile, photos, likes, and match access.',
  },
  {
    q: 'How is my information protected?',
    a: 'Your email address, full date of birth, phone number, and private account IDs are never displayed publicly. Only general city/metro locations are shown, and database security relies on Row Level Security (RLS) so private messages and reports remain strictly restricted.',
  },
];

export function AboutFaqPage({ onNavigate }: AboutFaqPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
      {/* Mission */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-4">
          <p className="text-sm font-semibold text-[#7256D9]">About Connectora</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#17243A] [text-wrap:balance]">
            Thoughtful technology for genuine adult connections.
          </h1>
          <p className="text-base text-[#74798A] leading-relaxed">
            Most social apps force everyone into a single rushed mold. Connectora was designed to
            give adults aged 18+ a calmer, clearer space to build meaningful friendships, expand
            social circles around shared interests, pursue serious relationships, or meet a life
            partner—without misleading metrics or dark patterns.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
            >
              Explore Sample Profiles
            </button>
            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-xl cursor-pointer"
            >
              Read Safety Center
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17243A]">
            <Globe className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
            <span>International Rollout Architecture</span>
          </div>
          <div className="divide-y divide-[#E4E6F0]">
            {COUNTRY_LIST.map((country) => (
              <div key={country.code} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#17243A]">
                    {country.flag} {country.name}
                  </p>
                  <p className="text-xs text-[#74798A]">
                    Dialing {country.dialCode} · {country.currency}
                  </p>
                </div>
                <span className="text-xs font-medium text-[#7256D9]">{country.marketStatus}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#74798A] pt-2 border-t border-[#E4E6F0] inline-flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7256D9] shrink-0" aria-hidden="true" />
            <span>Built to support additional countries cleanly without exposing exact user addresses.</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#7256D9]">Frequently Asked Questions</p>
          <h2 id="faq-heading" className="font-display text-2xl sm:text-3xl font-bold text-[#17243A]">
            Clear answers on eligibility, matching, and privacy.
          </h2>
        </div>

        <div className="bg-white border border-[#E4E6F0] rounded-2xl divide-y divide-[#E4E6F0]">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#FCFBFF] cursor-pointer"
                >
                  <span className="font-display text-base font-semibold text-[#17243A]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#74798A] shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-[#7256D9]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-[#74798A]">{item.a}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

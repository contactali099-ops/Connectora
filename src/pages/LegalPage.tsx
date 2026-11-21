import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AppRoute } from '../types/platform';

interface LegalPageProps {
  route: 'contact' | 'privacy' | 'terms' | 'guidelines' | 'cookies';
  onNavigate: (route: AppRoute) => void;
}

export function LegalPage({ route, onNavigate }: LegalPageProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');

  if (route === 'contact') {
    const handleContact = (e: React.FormEvent) => {
      e.preventDefault();
      setContactError('');
      if (contactName.trim().length < 2) {
        setContactError('Please enter your name.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        setContactError('Please enter a valid email address.');
        return;
      }
      if (contactMessage.trim().length < 10) {
        setContactError('Please enter a message of at least 10 characters.');
        return;
      }
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#7256D9]">Support &amp; Inquiries</p>
          <h1 className="font-display text-3xl font-bold text-[#17243A]">Contact Connectora</h1>
          <p className="text-sm text-[#74798A]">
            Questions about 18+ eligibility, privacy protections, or international rollout? Send us
            a note. For urgent user safety reports, please use the{' '}
            <button
              type="button"
              onClick={() => onNavigate('safety')}
              className="text-[#7256D9] underline cursor-pointer"
            >
              Safety Center report form
            </button>
            .
          </p>
        </div>

        <form
          onSubmit={handleContact}
          className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-4"
        >
          {contactSent && (
            <div className="p-4 rounded-xl bg-[#EEE9FF] border border-[#D9CEF9] text-sm text-[#17243A] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#7256D9] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Message validated (Preview Mode). Connect a backend form endpoint or Supabase Edge
                Function to receive live support submissions.
              </span>
            </div>
          )}
          {contactError && (
            <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-sm text-[#B42318]">
              {contactError}
            </div>
          )}

          <div>
            <label htmlFor="c-name" className="block text-xs font-semibold text-[#20243A] mb-1.5">
              Your Name
            </label>
            <input
              id="c-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
            />
          </div>
          <div>
            <label htmlFor="c-email" className="block text-xs font-semibold text-[#20243A] mb-1.5">
              Email Address
            </label>
            <input
              id="c-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
            />
          </div>
          <div>
            <label htmlFor="c-msg" className="block text-xs font-semibold text-[#20243A] mb-1.5">
              Message
            </label>
            <textarea
              id="c-msg"
              rows={4}
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              className="w-full p-3.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  }

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How Connectora protects personal data and isolates private records.',
      sections: [
        {
          heading: '1. Data Minimization & Public Isolation',
          text: 'Your email address, phone number, exact date of birth, and internal account identifiers are stored privately and never displayed on public discovery cards or shared with other users.',
        },
        {
          heading: '2. General Location Only',
          text: 'Connectora displays only general city or metro areas (or country only, per your visibility settings). Never enter a street address into your public profile.',
        },
        {
          heading: '3. Private Conversations & Safety Reports',
          text: 'Private messages are restricted to mutually matched, non-blocked adults. Safety reports are strictly private to authorized moderation staff.',
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      subtitle: '18+ eligibility, respectful conduct, and launch membership terms.',
      sections: [
        {
          heading: '1. Strict 18+ Adult Eligibility',
          text: 'You must be at least 18 years old to register or use any Connectora feature. Accounts providing false birthdates or belonging to minors are immediately blocked and terminated.',
        },
        {
          heading: '2. Free Launch Membership',
          text: 'Connectora launches free of charge in the United States. Paid memberships are disabled until full legal and payment processing readiness.',
        },
        {
          heading: '3. Account Suspension & Termination',
          text: 'Connectora reserves the right to suspend or remove accounts that violate Community Guidelines, engage in harassment, impersonation, spam, or underage misrepresentation.',
        },
      ],
    },
    guidelines: {
      title: 'Community Guidelines',
      subtitle: 'Standards for respectful adult friendships and relationships.',
      sections: [
        {
          heading: '1. Authenticity & Respect',
          text: 'Represent yourself honestly. Impersonation, deceptive profiles, and non-consensual behavior are prohibited.',
        },
        {
          heading: '2. Zero Harassment or Spam',
          text: 'Harassment, hate speech, unsolicited commercial promotion, and financial scams result in immediate enforcement action.',
        },
        {
          heading: '3. Consent & Boundaries',
          text: 'Respect every member’s right to pass, unmatch, or block without confrontation.',
        },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      subtitle: 'Essential session and security storage practices.',
      sections: [
        {
          heading: '1. Essential Session Storage',
          text: 'Connectora uses strictly necessary browser storage and authentication session tokens to maintain your signed-in state and security preferences.',
        },
        {
          heading: '2. No Third-Party Ad Tracking',
          text: 'We do not sell personal profile data or run invasive third-party advertising trackers inside private adult member areas.',
        },
      ],
    },
  };

  const doc = contentMap[route];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#7256D9]">Connectora Policies</p>
        <h1 className="font-display text-3xl font-bold text-[#17243A]">{doc.title}</h1>
        <p className="text-sm text-[#74798A]">{doc.subtitle}</p>
      </div>

      <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-6">
        {doc.sections.map((sec) => (
          <section key={sec.heading} className="space-y-2">
            <h2 className="font-display text-lg font-bold text-[#17243A]">{sec.heading}</h2>
            <p className="text-sm leading-relaxed text-[#20243A]">{sec.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

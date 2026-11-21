import { AppRoute } from '../types/platform';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const linkClass =
    'text-sm text-[#C7CDD9] hover:text-white transition-colors text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F18AA8] rounded-sm';

  return (
    <footer className="bg-[#17243A] text-[#FCFBFF] border-t border-[#253552]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F18AA8] rounded-md"
              aria-label="Connectora home"
            >
              <Logo variant="light" />
            </button>
            <p className="text-sm leading-relaxed text-[#C7CDD9] max-w-sm">
              An international community exclusively for adults aged 18+ to build meaningful
              friendships, social circles, serious relationships, and life partnerships.
            </p>
            <p className="text-xs text-[#9AA3B5]">
              Launching in the United States (USD) · Architecture ready for Canada &amp; United Kingdom
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">Platform</h3>
            <ul className="space-y-2.5">
              <li>
                <button type="button" onClick={() => onNavigate('discover')} className={linkClass}>
                  Discover
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className={linkClass}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('membership')} className={linkClass}>
                  Membership
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('about')} className={linkClass}>
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-white">Support &amp; Safety</h3>
            <ul className="space-y-2.5">
              <li>
                <button type="button" onClick={() => onNavigate('safety')} className={linkClass}>
                  Safety Center
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('moderation')} className={linkClass}>
                  Moderation Desk
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('contact')} className={linkClass}>
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-semibold text-white">Legal &amp; Policies</h3>
            <ul className="space-y-2.5">
              <li>
                <button type="button" onClick={() => onNavigate('privacy')} className={linkClass}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('terms')} className={linkClass}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('guidelines')} className={linkClass}>
                  Community Guidelines
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('cookies')} className={linkClass}>
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#9AA3B5]">
          <p>© {new Date().getFullYear()} Connectora. Strictly for adults aged 18 and older.</p>
          <p>Privacy-first design · Exact addresses and birthdates are never shared publicly.</p>
        </div>
      </div>
    </footer>
  );
}

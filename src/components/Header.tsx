import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, User, ShieldCheck, Crown, LogOut } from 'lucide-react';
import { AppRoute, PrivateUserProfile } from '../types/platform';
import { Logo } from './Logo';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  currentUser: PrivateUserProfile | null;
  unreadMessagesCount: number;
  onSignOut: () => void;
}

export function Header({
  currentRoute,
  onNavigate,
  currentUser,
  unreadMessagesCount,
  onSignOut,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLinkClick = (route: AppRoute) => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    onNavigate(route);
  };

  const publicNavItems: { label: string; route: AppRoute; count?: number }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Discover', route: 'discover' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'Safety', route: 'safety' },
    { label: 'About', route: 'about' },
  ];

  const memberNavItems: { label: string; route: AppRoute; count?: number }[] = [
    { label: 'Discover', route: 'discover' },
    { label: 'Matches', route: 'matches' },
    { label: 'Messages', route: 'messages', count: unreadMessagesCount },
    { label: 'Safety', route: 'safety' },
    { label: 'Profile', route: 'profile' },
  ];

  const navItems = currentUser ? memberNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FCFBFF]/90 backdrop-blur-md border-b border-[#E4E6F0]">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7256D9] rounded-md cursor-pointer"
          aria-label="Connectora home"
        >
          <Logo />
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive =
              currentRoute === item.route ||
              (item.route === 'how-it-works' && currentRoute === 'home');
            const showActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`relative py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7256D9] rounded-sm ${
                  showActive
                    ? 'text-[#17243A] font-semibold'
                    : isActive
                      ? 'text-[#20243A]'
                      : 'text-[#74798A] hover:text-[#17243A]'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="ml-1.5 text-xs font-mono tabular-nums text-[#7256D9] font-semibold">
                    ({item.count})
                  </span>
                )}
                {showActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7256D9] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Account / Auth Action */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {!currentUser ? (
            <>
              <button
                type="button"
                onClick={() => handleLinkClick('login')}
                className="px-3 py-2 text-sm font-medium text-[#20243A] hover:text-[#7256D9] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7256D9] rounded-lg"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => handleLinkClick('register')}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7256D9]"
              >
                Join Free
              </button>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7256D9]"
              >
                <span className="max-w-[120px] truncate">{currentUser.displayName}</span>
                <ChevronDown className="w-4 h-4 text-[#74798A]" aria-hidden="true" />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E4E6F0] rounded-xl shadow-lg py-1.5 z-50"
                >
                  <div className="px-4 py-2 border-b border-[#E4E6F0]">
                    <p className="text-sm font-semibold text-[#17243A] truncate">
                      {currentUser.displayName}
                    </p>
                    <p className="text-xs text-[#74798A]">
                      {currentUser.isDemo ? 'Demo Adult Session' : 'Verified 18+ Member'}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleLinkClick('profile')}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#20243A] hover:bg-[#F4F5F8] flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#74798A]" aria-hidden="true" />
                    <span>Profile &amp; Settings</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleLinkClick('membership')}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#20243A] hover:bg-[#F4F5F8] flex items-center gap-2.5 cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-[#74798A]" aria-hidden="true" />
                    <span>Membership Plan</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleLinkClick('moderation')}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#20243A] hover:bg-[#F4F5F8] flex items-center gap-2.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#74798A]" aria-hidden="true" />
                    <span>Moderation Console</span>
                  </button>
                  <div className="my-1 border-t border-[#E4E6F0]" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-[#B42318] hover:bg-[#FEF3F2] flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {!currentUser && (
            <button
              type="button"
              onClick={() => handleLinkClick('register')}
              className="px-3.5 py-2 min-h-[44px] text-xs font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Join Free
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-[#E4E6F0] text-[#17243A] hover:bg-[#F4F5F8] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFBFF] border-b border-[#E4E6F0] shadow-lg">
          <nav aria-label="Mobile navigation" className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`w-full min-h-[44px] px-3 py-2.5 text-left text-base font-medium rounded-lg flex items-center justify-between cursor-pointer ${
                  currentRoute === item.route
                    ? 'bg-[#EEE9FF] text-[#17243A] font-semibold'
                    : 'text-[#20243A] hover:bg-[#F4F5F8]'
                }`}
              >
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-xs font-mono tabular-nums text-[#7256D9] font-semibold">
                    {item.count} unread
                  </span>
                )}
              </button>
            ))}

            {currentUser ? (
              <>
                <div className="pt-2 mt-2 border-t border-[#E4E6F0] space-y-1">
                  <button
                    type="button"
                    onClick={() => handleLinkClick('membership')}
                    className="w-full min-h-[44px] px-3 py-2.5 text-left text-base font-medium text-[#20243A] hover:bg-[#F4F5F8] rounded-lg cursor-pointer"
                  >
                    Membership Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('moderation')}
                    className="w-full min-h-[44px] px-3 py-2.5 text-left text-base font-medium text-[#20243A] hover:bg-[#F4F5F8] rounded-lg cursor-pointer"
                  >
                    Moderation Console
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full min-h-[44px] px-3 py-2.5 text-left text-base font-medium text-[#B42318] hover:bg-[#FEF3F2] rounded-lg cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 mt-2 border-t border-[#E4E6F0] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleLinkClick('login')}
                  className="w-full min-h-[44px] px-4 py-2.5 text-center text-base font-medium text-[#17243A] border border-[#E4E6F0] rounded-lg hover:bg-[#F4F5F8] cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => handleLinkClick('register')}
                  className="w-full min-h-[44px] px-4 py-2.5 text-center text-base font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg cursor-pointer"
                >
                  Join Connectora — It&apos;s Free
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

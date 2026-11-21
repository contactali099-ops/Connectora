import { useState } from 'react';
import { Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { AppRoute, CountryCode, PrivateUserProfile } from '../types/platform';
import { COUNTRY_LIST, SUPPORTED_COUNTRIES } from '../data/countries';
import { getMaxAdultBirthDateISO, isEligibleAdult } from '../utils/ageVerification';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface AuthPageProps {
  initialMode: 'login' | 'register';
  onNavigate: (route: AppRoute) => void;
  onDemoSignIn: (customProfile?: PrivateUserProfile) => void;
}

export function AuthPage({ initialMode, onNavigate, onDemoSignIn }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Registration state
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmBirthYear, setConfirmBirthYear] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [generalLocation, setGeneralLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [ageAssuranceConfirmed, setAgeAssuranceConfirmed] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const dobCheck = dateOfBirth ? isEligibleAdult(dateOfBirth) : null;
  const countryConfig = SUPPORTED_COUNTRIES[countryCode];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setLoginError('Please enter a valid email address.');
      return;
    }
    if (loginPassword.length < 8) {
      setLoginError('Password must be at least 8 characters.');
      return;
    }

    setLoginError(
      'Live Supabase Authentication is not yet configured in environment variables. Use the Demo Adult Session button below to preview authenticated member workflows.'
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      return;
    }
    setResetSent(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (displayName.trim().length < 2) {
      setRegisterError('Please enter a display name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    if (password.length < 10) {
      setRegisterError('For account security, passwords must be at least 10 characters.');
      return;
    }

    const ageResult = isEligibleAdult(dateOfBirth);
    if (!ageResult.valid || ageResult.age === null) {
      setRegisterError(ageResult.reason ?? 'Strict 18+ age eligibility check failed.');
      return;
    }

    const expectedYear = dateOfBirth.split('-')[0];
    if (confirmBirthYear.trim() !== expectedYear) {
      setRegisterError(
        'Age-assurance confirmation failed: please re-enter your 4-digit birth year matching your date of birth.'
      );
      return;
    }

    if (!ageAssuranceConfirmed) {
      setRegisterError('Please complete the adult age-assurance confirmation.');
      return;
    }

    if (generalLocation.trim().length < 2) {
      setRegisterError('Please enter your general city or metro area (never a street address).');
      return;
    }

    if (!acceptedPolicies) {
      setRegisterError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    // Create an interactive Demo Preview session initialized with the verified 18+ user inputs
    const previewProfile: PrivateUserProfile = {
      id: 'demo-registered-adult',
      displayName: displayName.trim(),
      age: ageResult.age,
      dateOfBirth,
      email: email.trim(),
      phoneNumber: phoneNumber.trim() ? `${countryConfig.dialCode} ${phoneNumber.trim()}` : undefined,
      countryCode,
      generalLocation: generalLocation.trim(),
      bio: 'New adult member exploring Connectora in Interactive Preview mode.',
      interests: ['Coffee & Cafes', 'Travel'],
      languages: ['English'],
      intentions: ['Friendship', 'Social Connections'],
      photos: ['/src/assets/images/hero_connection_lifestyle_1795259326232.jpg'],
      isDemo: true,
      status: 'active',
      role: 'member',
      ageVerifiedMethod: 'dob_and_assurance',
      visibility: {
        showLocationPublic: true,
        showLanguagesPublic: true,
        showInDiscovery: true,
      },
    };

    onDemoSignIn(previewProfile);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6">
      <PreviewModeBanner contextNote="Authentication UI includes full 18+ DOB enforcement and validation. Connect Supabase Auth to persist live user accounts and email verification." />

      <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-10 space-y-8">
        {/* Segmented Auth Mode Switch */}
        <div className="flex items-center gap-2 p-1 bg-[#F4F5F8] rounded-xl max-w-sm">
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#17243A] shadow-xs'
                : 'text-[#74798A] hover:text-[#17243A]'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'login' || mode === 'forgot'
                ? 'bg-white text-[#17243A] shadow-xs'
                : 'text-[#74798A] hover:text-[#17243A]'
            }`}
          >
            Log In
          </button>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17243A]">
                Welcome back to Connectora
              </h1>
              <p className="text-sm text-[#74798A]">
                Sign in with your verified 18+ adult account credentials.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-sm text-[#B42318] flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-[#20243A]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setMode('forgot');
                  }}
                  className="text-xs font-semibold text-[#7256D9] hover:text-[#5E43C4] cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full min-h-[44px] px-3.5 py-2.5 pr-11 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#74798A] hover:text-[#17243A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] px-5 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <div className="pt-5 border-t border-[#E4E6F0] space-y-3">
              <p className="text-xs text-[#74798A]">
                Evaluating the platform before connecting Supabase? Launch a clearly labeled Demo
                Adult Session (30 yrs, Moderator &amp; Member Preview):
              </p>
              <button
                type="button"
                onClick={() => onDemoSignIn()}
                className="w-full min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#17243A] bg-[#EEE9FF] hover:bg-[#E1D8FE] rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Enter Demo Adult Preview Session</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold text-[#17243A]">Reset Password</h1>
              <p className="text-sm text-[#74798A]">
                Enter the email associated with your Connectora account to prepare a password reset
                request.
              </p>
            </div>

            {resetSent ? (
              <div className="p-4 rounded-xl bg-[#EEE9FF] border border-[#D9CEF9] text-sm text-[#17243A] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#7256D9] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Reset validation complete (Preview Mode)</p>
                  <p className="text-xs text-[#20243A]/85 mt-1">
                    When connected to Supabase Auth, a secure one-time password recovery link will
                    be emailed to {resetEmail}.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="reset-email" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              {!resetSent && (
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
                >
                  Request Reset Link
                </button>
              )}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#74798A] hover:text-[#17243A] cursor-pointer"
              >
                Back to Log In
              </button>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5" noValidate>
            <div className="space-y-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17243A]">
                Join Connectora (18+ Adults Only)
              </h1>
              <p className="text-sm text-[#74798A]">
                Free to join at launch. Your full date of birth and email are never displayed on
                your public profile.
              </p>
            </div>

            {registerError && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-sm text-[#B42318] flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{registerError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Display Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="First name or initials"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Password (min. 10 characters)
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full min-h-[44px] px-3.5 py-2.5 pr-11 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#74798A] hover:text-[#17243A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-dob" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Date of Birth (Private · Must be 18+)
                </label>
                <input
                  id="reg-dob"
                  type="date"
                  required
                  max={getMaxAdultBirthDateISO()}
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl tabular-nums focus:outline-2 focus:outline-[#7256D9]"
                />
                {dobCheck && !dobCheck.valid && (
                  <p className="mt-1.5 text-xs font-medium text-[#B42318]">{dobCheck.reason}</p>
                )}
                {dobCheck && dobCheck.valid && (
                  <p className="mt-1.5 text-xs text-[#7256D9] tabular-nums">
                    Verified adult age: {dobCheck.age} years (exact DOB remains private)
                  </p>
                )}
              </div>
            </div>

            {/* Age-assurance verification step (beyond a single passive checkbox) */}
            <div className="p-4 rounded-xl bg-[#F4F5F8] border border-[#E4E6F0] space-y-3">
              <p className="text-xs font-semibold text-[#17243A]">
                18+ Age-Assurance Confirmation
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="confirm-birth-year" className="block text-xs text-[#74798A] mb-1">
                    Re-enter your 4-digit birth year to verify
                  </label>
                  <input
                    id="confirm-birth-year"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmBirthYear}
                    onChange={(e) => setConfirmBirthYear(e.target.value.replace(/\D/g, ''))}
                    placeholder="YYYY"
                    className="w-full min-h-[42px] px-3 py-2 text-sm bg-white border border-[#E4E6F0] rounded-lg tabular-nums focus:outline-2 focus:outline-[#7256D9]"
                  />
                </div>
                <label className="flex items-start gap-2.5 text-xs text-[#20243A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageAssuranceConfirmed}
                    onChange={(e) => setAgeAssuranceConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#7256D9]"
                  />
                  <span>
                    I attest that I am at least 18 years old and understand identity/age assurance
                    may be required before messaging.
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="reg-country" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Country
                </label>
                <select
                  id="reg-country"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value as CountryCode)}
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                >
                  {COUNTRY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-location" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  General City / Metro
                </label>
                <input
                  id="reg-location"
                  type="text"
                  required
                  value={generalLocation}
                  onChange={(e) => setGeneralLocation(e.target.value)}
                  placeholder={countryConfig.sampleRegions[0]}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Phone ({countryConfig.dialCode}, Optional)
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={countryConfig.phonePlaceholder}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl tabular-nums focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs sm:text-sm text-[#20243A] cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#7256D9]"
              />
              <span>
                I agree to Connectora&apos;s{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="text-[#7256D9] underline cursor-pointer"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="text-[#7256D9] underline cursor-pointer"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={Boolean(dobCheck && !dobCheck.valid)}
              className="w-full min-h-[46px] px-5 py-3 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] disabled:bg-[#C7CDD9] disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
            >
              Create 18+ Preview Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

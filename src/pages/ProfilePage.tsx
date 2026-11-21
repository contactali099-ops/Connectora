import { useState } from 'react';
import { Upload, CheckCircle2, ShieldAlert, Trash2, Lock } from 'lucide-react';
import { ConnectionIntention, CountryCode, PrivateUserProfile } from '../types/platform';
import { ALL_INTERESTS, ALL_LANGUAGES, COUNTRY_LIST } from '../data/countries';
import { validateImageUpload } from '../utils/ageVerification';
import { SafeImage } from '../components/SafeImage';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface ProfilePageProps {
  currentUser: PrivateUserProfile | null;
  onUpdateProfile: (updated: PrivateUserProfile) => void;
  onDeleteAccount: () => void;
  onRequireAuth: () => void;
}

const INTENTIONS: ConnectionIntention[] = [
  'Friendship',
  'Social Connections',
  'Serious Relationships',
  'Life Partner',
];

export function ProfilePage({
  currentUser,
  onUpdateProfile,
  onDeleteAccount,
  onRequireAuth,
}: ProfilePageProps) {
  const [draft, setDraft] = useState<PrivateUserProfile | null>(currentUser);
  const [savedNotice, setSavedNotice] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!currentUser || !draft) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#E4E6F0] rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-[#17243A]">
            Sign in to manage your Connectora profile
          </h1>
          <p className="text-sm text-[#74798A] max-w-md mx-auto">
            Create an 18+ preview account or launch the Demo Adult Session to edit your profile,
            photos, and privacy visibility settings.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
          >
            Go to Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const toggleItem = <T extends string>(list: T[], value: T): T[] => {
    return list.includes(value) ? list.filter((i) => i !== value) : [...list, value];
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageUpload(file);
    if (!validation.valid) {
      setPhotoError(validation.error ?? 'Invalid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const nextPhotos = [reader.result, ...draft.photos.slice(0, 3)];
        const updated = { ...draft, photos: nextPhotos };
        setDraft(updated);
        onUpdateProfile(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#7256D9]">Member Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-[#17243A]">
          Your Profile &amp; Privacy Settings
        </h1>
        <p className="text-sm text-[#74798A]">
          Control what other adults see on your public profile. Your email, full date of birth,
          phone number, and exact address are never displayed publicly.
        </p>
      </div>

      <PreviewModeBanner contextNote="Profile edits, photo validation, and visibility settings update your active Preview Session immediately. Connect Supabase Storage and PostgreSQL to persist across devices." />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photos & Private Account Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#17243A]">Profile Photo</h2>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F4F5F8] border border-[#E4E6F0]">
              <SafeImage
                src={draft.photos[0] ?? ''}
                alt={`${draft.displayName} profile`}
                className="w-full h-full object-cover"
                fallbackLabel={draft.displayName}
              />
            </div>

            {photoError && (
              <div className="p-3 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-xs text-[#B42318] flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{photoError}</span>
              </div>
            )}

            <label className="w-full min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
              <span>Upload Photo (JPG/PNG/WebP ≤ 5MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>
          </div>

          <div className="bg-[#F4F5F8] border border-[#E4E6F0] rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#17243A]">
              <Lock className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
              <span>Private Account Data (Never Public)</span>
            </div>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="text-[#74798A]">Email</dt>
                <dd className="font-medium text-[#20243A] truncate">{draft.email}</dd>
              </div>
              <div>
                <dt className="text-[#74798A]">Date of Birth</dt>
                <dd className="font-medium text-[#20243A] tabular-nums">
                  {draft.dateOfBirth} (Public shows age {draft.age} only)
                </dd>
              </div>
              {draft.phoneNumber && (
                <div>
                  <dt className="text-[#74798A]">Phone</dt>
                  <dd className="font-medium text-[#20243A] tabular-nums">{draft.phoneNumber}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Right Column: Public Profile & Visibility */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-lg font-bold text-[#17243A]">Public Profile Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-name" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Display Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={draft.displayName}
                  onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                />
              </div>

              <div>
                <label htmlFor="prof-country" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                  Country
                </label>
                <select
                  id="prof-country"
                  value={draft.countryCode}
                  onChange={(e) =>
                    setDraft({ ...draft, countryCode: e.target.value as CountryCode })
                  }
                  className="w-full min-h-[44px] px-3 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                >
                  {COUNTRY_LIST.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="prof-location" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                General Metro / City (Never enter street address)
              </label>
              <input
                id="prof-location"
                type="text"
                value={draft.generalLocation}
                onChange={(e) => setDraft({ ...draft, generalLocation: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              />
            </div>

            <div>
              <label htmlFor="prof-bio" className="block text-xs font-semibold text-[#20243A] mb-1.5">
                Biography
              </label>
              <textarea
                id="prof-bio"
                rows={4}
                maxLength={800}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                className="w-full p-3.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
              />
              <p className="mt-1 text-xs text-[#74798A] tabular-nums">
                {draft.bio.length} / 800 characters
              </p>
            </div>

            {/* Intentions */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#20243A]">
                Relationship &amp; Connection Intentions (18+)
              </span>
              <div className="flex flex-wrap gap-2">
                {INTENTIONS.map((item) => {
                  const selected = draft.intentions.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          intentions: toggleItem(draft.intentions, item),
                        })
                      }
                      className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#EEE9FF] border-[#7256D9] text-[#17243A]'
                          : 'bg-[#FCFBFF] border-[#E4E6F0] text-[#74798A] hover:text-[#17243A]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#20243A]">Interests</span>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((item) => {
                  const selected = draft.interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          interests: toggleItem(draft.interests, item),
                        })
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#EEE9FF] border-[#7256D9] text-[#17243A]'
                          : 'bg-[#FCFBFF] border-[#E4E6F0] text-[#74798A] hover:text-[#17243A]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-[#20243A]">Languages</span>
              <div className="flex flex-wrap gap-2">
                {ALL_LANGUAGES.map((lang) => {
                  const selected = draft.languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          languages: toggleItem(draft.languages, lang),
                        })
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-[#EEE9FF] border-[#7256D9] text-[#17243A]'
                          : 'bg-[#FCFBFF] border-[#E4E6F0] text-[#74798A] hover:text-[#17243A]'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Public Visibility Controls */}
          <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#17243A]">
              Profile Visibility Controls
            </h2>
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.visibility.showInDiscovery}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      visibility: { ...draft.visibility, showInDiscovery: e.target.checked },
                    })
                  }
                  className="mt-1 w-4 h-4 accent-[#7256D9]"
                />
                <span>
                  <strong className="block text-[#17243A]">Appear in Discover</strong>
                  <span className="text-xs text-[#74798A]">
                    Uncheck to pause new discovery while keeping existing matches active.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.visibility.showLocationPublic}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      visibility: { ...draft.visibility, showLocationPublic: e.target.checked },
                    })
                  }
                  className="mt-1 w-4 h-4 accent-[#7256D9]"
                />
                <span>
                  <strong className="block text-[#17243A]">Show General Metro Area</strong>
                  <span className="text-xs text-[#74798A]">
                    Displays city/region only (e.g. Denver, CO). Hide to show Country only.
                  </span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.visibility.showLanguagesPublic}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      visibility: { ...draft.visibility, showLanguagesPublic: e.target.checked },
                    })
                  }
                  className="mt-1 w-4 h-4 accent-[#7256D9]"
                />
                <span>
                  <strong className="block text-[#17243A]">Show Languages Spoken</strong>
                  <span className="text-xs text-[#74798A]">
                    Helps other members find shared conversation languages.
                  </span>
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#E4E6F0] flex flex-wrap items-center justify-between gap-4">
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>

              {savedNotice && (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  Profile updated in preview session
                </span>
              )}
            </div>
          </div>

          {/* Account Deletion */}
          <div className="bg-white border border-[#E4E6F0] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#17243A]">Account Management</h2>
            <p className="text-sm text-[#74798A]">
              Deleting your account permanently removes your profile, photos, likes, and match
              access.
            </p>
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="min-h-[44px] px-4 py-2 text-sm font-semibold text-[#B42318] bg-[#FEF3F2] hover:bg-[#FEE4E2] border border-[#FECDCA] rounded-xl inline-flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>Delete Account</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] space-y-3">
                <p className="text-sm font-semibold text-[#B42318]">
                  Confirm account deletion and exit preview session?
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onDeleteAccount}
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#B42318] hover:bg-[#912018] rounded-lg cursor-pointer"
                  >
                    Confirm Delete Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#20243A] bg-white border border-[#E4E6F0] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

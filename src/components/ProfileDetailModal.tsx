import { X, Heart, Flag, Ban, MessageSquare, MapPin, Globe } from 'lucide-react';
import { PublicProfile } from '../types/platform';
import { SUPPORTED_COUNTRIES } from '../data/countries';
import { SafeImage } from './SafeImage';

interface ProfileDetailModalProps {
  profile: PublicProfile | null;
  isLiked: boolean;
  isMatched: boolean;
  isBlocked: boolean;
  onClose: () => void;
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  onMessage: (profileId: string) => void;
  onBlock: (profileId: string) => void;
  onReport: (profileId: string) => void;
}

export function ProfileDetailModal({
  profile,
  isLiked,
  isMatched,
  isBlocked,
  onClose,
  onLike,
  onPass,
  onMessage,
  onBlock,
  onReport,
}: ProfileDetailModalProps) {
  if (!profile) return null;

  const country = SUPPORTED_COUNTRIES[profile.countryCode];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17243A]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFBFF] border border-[#E4E6F0] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#FCFBFF]/95 backdrop-blur-xs border-b border-[#E4E6F0]">
          <div className="flex items-center gap-2 text-sm text-[#74798A]">
            {profile.isDemo && <span>Sample Profile (Demo)</span>}
            {profile.isDemo && <span aria-hidden="true">·</span>}
            <span>18+ Adult Community</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile details"
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#74798A] hover:text-[#17243A] hover:bg-[#F4F5F8] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F4F5F8] border border-[#E4E6F0]">
              <SafeImage
                src={profile.photos[0] ?? ''}
                alt={`${profile.displayName} sample profile portrait`}
                className="w-full h-full object-cover"
                fallbackLabel={profile.displayName}
              />
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h2
                  id="profile-modal-title"
                  className="font-display text-2xl font-bold text-[#17243A] tabular-nums"
                >
                  {profile.displayName}, {profile.age}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#74798A]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {profile.generalLocation}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {country.flag} {country.name}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E6F0]">
                <p className="text-xs font-semibold text-[#74798A] mb-1">Looking for</p>
                <p className="text-sm font-medium text-[#17243A]">
                  {profile.intentions.join(' · ')}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#74798A] mb-1">About</p>
                <p className="text-sm leading-relaxed text-[#20243A]">{profile.bio}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#74798A] mb-1">Interests</p>
                <p className="text-sm text-[#20243A]">{profile.interests.join(' · ')}</p>
              </div>

              {profile.languages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#74798A] mb-1">Languages</p>
                  <p className="text-sm text-[#20243A] inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#74798A]" aria-hidden="true" />
                    {profile.languages.join(' · ')}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E4E6F0] space-y-3">
              {!isBlocked && (
                <div className="flex flex-wrap items-center gap-3">
                  {isMatched ? (
                    <button
                      type="button"
                      onClick={() => onMessage(profile.id)}
                      className="flex-1 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                      <span>Send Message</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => onLike(profile.id)}
                        disabled={isLiked}
                        className={`flex-1 min-h-[44px] px-4 py-2.5 text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          isLiked
                            ? 'bg-[#EEE9FF] text-[#7256D9] cursor-default'
                            : 'bg-[#7256D9] hover:bg-[#5E43C4] text-white'
                        }`}
                      >
                        <Heart className="w-4 h-4" aria-hidden="true" />
                        <span>{isLiked ? 'Interest Sent' : 'Like Profile'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onPass(profile.id);
                          onClose();
                        }}
                        className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-[#20243A] bg-[#F4F5F8] hover:bg-[#E4E6F0] rounded-lg cursor-pointer"
                      >
                        Pass
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-xs text-[#74798A]">
                <button
                  type="button"
                  onClick={() => {
                    onReport(profile.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 py-1.5 hover:text-[#17243A] cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Report Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onBlock(profile.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 py-1.5 hover:text-[#B42318] cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{isBlocked ? 'Unblock User' : 'Block User'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

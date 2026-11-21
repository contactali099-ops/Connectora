import { useState } from 'react';
import { MessageSquare, UserX, Heart, Eye, ShieldOff } from 'lucide-react';
import { MatchRecord, PublicProfile } from '../types/platform';
import { SUPPORTED_COUNTRIES } from '../data/countries';
import { SafeImage } from '../components/SafeImage';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface MatchesPageProps {
  profiles: PublicProfile[];
  matches: MatchRecord[];
  likedSentIds: string[];
  likedReceivedIds: string[];
  blockedIds: string[];
  onLike: (profileId: string) => void;
  onWithdrawLike: (profileId: string) => void;
  onUnmatch: (matchId: string) => void;
  onUnblock: (profileId: string) => void;
  onOpenMessages: (profileId: string) => void;
  onViewProfile: (profile: PublicProfile) => void;
}

type MatchTab = 'mutual' | 'sent' | 'received' | 'blocked';

export function MatchesPage({
  profiles,
  matches,
  likedSentIds,
  likedReceivedIds,
  blockedIds,
  onLike,
  onWithdrawLike,
  onUnmatch,
  onUnblock,
  onOpenMessages,
  onViewProfile,
}: MatchesPageProps) {
  const [activeTab, setActiveTab] = useState<MatchTab>('mutual');
  const [confirmUnmatchId, setConfirmUnmatchId] = useState<string | null>(null);

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const activeMatches = matches.filter(
    (m) => m.status === 'active' && !blockedIds.includes(m.profileId)
  );
  const matchedProfileIds = new Set(activeMatches.map((m) => m.profileId));

  const sentOnly = likedSentIds.filter(
    (id) => !matchedProfileIds.has(id) && !blockedIds.includes(id)
  );
  const receivedOnly = likedReceivedIds.filter(
    (id) => !matchedProfileIds.has(id) && !blockedIds.includes(id)
  );

  const tabs: { key: MatchTab; label: string; count: number }[] = [
    { key: 'mutual', label: 'Mutual Matches', count: activeMatches.length },
    { key: 'received', label: 'Likes Received', count: receivedOnly.length },
    { key: 'sent', label: 'Likes Sent', count: sentOnly.length },
    { key: 'blocked', label: 'Blocked', count: blockedIds.length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#7256D9]">Connections &amp; Mutual Interest</p>
        <h1 className="font-display text-3xl font-bold text-[#17243A]">Likes &amp; Matches</h1>
        <p className="text-sm text-[#74798A]">
          Matches are created only when both adults express mutual interest. Duplicate matches and
          blocked-user interactions are automatically prevented.
        </p>
      </div>

      <PreviewModeBanner contextNote="Matches and likes shown here operate against Sample Profiles in local preview mode. Live mutual-match triggers and RLS policies are defined in supabase/schema.sql." />

      {/* Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4F5F8] rounded-xl w-fit">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-white text-[#17243A] shadow-xs font-semibold'
                  : 'text-[#74798A] hover:text-[#17243A]'
              }`}
            >
              {tab.label} <span className="tabular-nums text-[#7256D9]">({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'mutual' && (
        <div className="space-y-4">
          {activeMatches.length === 0 ? (
            <div className="bg-white border border-[#E4E6F0] rounded-2xl p-10 text-center space-y-2">
              <h2 className="font-display text-lg font-bold text-[#17243A]">No mutual matches yet</h2>
              <p className="text-sm text-[#74798A]">
                When both you and another adult like each other, your match appears here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeMatches.map((match) => {
                const profile = profileMap.get(match.profileId);
                if (!profile) return null;
                const country = SUPPORTED_COUNTRIES[profile.countryCode];
                return (
                  <div
                    key={match.id}
                    className="bg-white border border-[#E4E6F0] rounded-2xl p-5 flex flex-col sm:flex-row gap-5 justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F4F5F8] border border-[#E4E6F0] shrink-0">
                        <SafeImage
                          src={profile.photos[0] ?? ''}
                          alt={profile.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#74798A]">
                          Mutual Match · {profile.isDemo ? 'Sample Profile' : '18+ Member'}
                        </p>
                        <h2 className="font-display text-lg font-bold text-[#17243A] tabular-nums">
                          {profile.displayName}, {profile.age}
                        </h2>
                        <p className="text-xs text-[#74798A]">
                          {profile.generalLocation} · {country.flag} {country.name}
                        </p>
                        <p className="text-xs font-medium text-[#7256D9]">
                          {profile.intentions.join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenMessages(profile.id)}
                        className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Message</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewProfile(profile)}
                        className="min-h-[40px] px-4 py-2 text-xs font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View</span>
                      </button>
                      {confirmUnmatchId === match.id ? (
                        <button
                          type="button"
                          onClick={() => {
                            onUnmatch(match.id);
                            setConfirmUnmatchId(null);
                          }}
                          className="min-h-[40px] px-3 py-2 text-xs font-semibold text-white bg-[#B42318] rounded-lg cursor-pointer"
                        >
                          Confirm Unmatch
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmUnmatchId(match.id)}
                          className="min-h-[40px] px-3 py-2 text-xs font-medium text-[#74798A] hover:text-[#B42318] inline-flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <UserX className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Unmatch</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'received' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {receivedOnly.length === 0 ? (
            <div className="md:col-span-2 bg-white border border-[#E4E6F0] rounded-2xl p-10 text-center text-sm text-[#74798A]">
              No pending likes received right now.
            </div>
          ) : (
            receivedOnly.map((id) => {
              const profile = profileMap.get(id);
              if (!profile) return null;
              return (
                <div
                  key={id}
                  className="bg-white border border-[#E4E6F0] rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F4F5F8] shrink-0">
                      <SafeImage
                        src={profile.photos[0] ?? ''}
                        alt={profile.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-[#74798A]">Expressed interest · Demo</p>
                      <h2 className="font-display text-lg font-bold text-[#17243A] tabular-nums">
                        {profile.displayName}, {profile.age}
                      </h2>
                      <p className="text-xs text-[#74798A]">{profile.generalLocation}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onLike(profile.id)}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Like Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onViewProfile(profile)}
                      className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#20243A] bg-[#F4F5F8] rounded-lg cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sentOnly.length === 0 ? (
            <div className="md:col-span-2 bg-white border border-[#E4E6F0] rounded-2xl p-10 text-center text-sm text-[#74798A]">
              You have no pending outgoing likes.
            </div>
          ) : (
            sentOnly.map((id) => {
              const profile = profileMap.get(id);
              if (!profile) return null;
              return (
                <div
                  key={id}
                  className="bg-white border border-[#E4E6F0] rounded-2xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F4F5F8] shrink-0">
                      <SafeImage
                        src={profile.photos[0] ?? ''}
                        alt={profile.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-[#74798A]">Awaiting mutual interest · Demo</p>
                      <h2 className="font-display text-lg font-bold text-[#17243A] tabular-nums">
                        {profile.displayName}, {profile.age}
                      </h2>
                      <p className="text-xs text-[#74798A]">{profile.generalLocation}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onViewProfile(profile)}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-[#17243A] bg-[#F4F5F8] rounded-lg cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onWithdrawLike(profile.id)}
                      className="min-h-[40px] px-4 py-2 text-xs font-medium text-[#74798A] hover:text-[#B42318] cursor-pointer"
                    >
                      Withdraw Like
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="space-y-4">
          {blockedIds.length === 0 ? (
            <div className="bg-white border border-[#E4E6F0] rounded-2xl p-10 text-center text-sm text-[#74798A]">
              No accounts are currently blocked.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blockedIds.map((id) => {
                const profile = profileMap.get(id);
                if (!profile) return null;
                return (
                  <div
                    key={id}
                    className="bg-white border border-[#E4E6F0] rounded-2xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-bold text-[#17243A]">{profile.displayName}</p>
                      <p className="text-xs text-[#74798A]">
                        Blocked — hidden from discovery and messaging
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUnblock(id)}
                      className="min-h-[40px] px-4 py-2 text-xs font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldOff className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Unblock</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Send, Flag, Ban, UserX, ArrowLeft, ShieldCheck } from 'lucide-react';
import {
  ConversationThread,
  MatchRecord,
  PrivateUserProfile,
  PublicProfile,
} from '../types/platform';
import { SafeImage } from '../components/SafeImage';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface MessagesPageProps {
  currentUser: PrivateUserProfile | null;
  profiles: PublicProfile[];
  matches: MatchRecord[];
  conversations: ConversationThread[];
  blockedIds: string[];
  activeProfileId: string | null;
  onSelectProfile: (profileId: string | null) => void;
  onSendMessage: (conversationId: string, body: string) => { ok: boolean; error?: string };
  onViewProfile: (profile: PublicProfile) => void;
  onBlock: (profileId: string) => void;
  onReport: (profileId: string) => void;
  onUnmatch: (matchId: string) => void;
  onRequireAuth: () => void;
}

export function MessagesPage({
  currentUser,
  profiles,
  matches,
  conversations,
  blockedIds,
  activeProfileId,
  onSelectProfile,
  onSendMessage,
  onViewProfile,
  onBlock,
  onReport,
  onUnmatch,
  onRequireAuth,
}: MessagesPageProps) {
  const [draftMessage, setDraftMessage] = useState('');
  const [sendError, setSendError] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#E4E6F0] rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-[#17243A]">
            Private Messaging Requires Sign-In
          </h1>
          <p className="text-sm text-[#74798A] max-w-md mx-auto">
            Only authenticated, mutually matched adults aged 18+ can exchange private messages.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="min-h-[44px] px-6 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
          >
            Sign In or Enter Demo Session
          </button>
        </div>
      </div>
    );
  }

  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const activeMatchMap = new Map(
    matches.filter((m) => m.status === 'active').map((m) => [m.profileId, m])
  );

  const visibleThreads = conversations.filter(
    (c) => activeMatchMap.has(c.participantId) && !blockedIds.includes(c.participantId)
  );

  const selectedThread =
    visibleThreads.find((t) => t.participantId === activeProfileId) ?? visibleThreads[0] ?? null;

  const selectedParticipant = selectedThread
    ? profileMap.get(selectedThread.participantId) ?? null
    : null;

  const selectedMatch = selectedParticipant
    ? activeMatchMap.get(selectedParticipant.id) ?? null
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    if (!selectedThread) return;

    const trimmed = draftMessage.trim();
    if (!trimmed) return;

    const result = onSendMessage(selectedThread.id, trimmed);
    if (!result.ok) {
      setSendError(result.error ?? 'Unable to send message.');
      return;
    }
    setDraftMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#7256D9]">Mutual-Match Private Messaging</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17243A]">Messages</h1>
      </div>

      <PreviewModeBanner contextNote="This interface demonstrates Connectora's mutual-match-only messaging workspace and anti-spam rate limiting in local preview mode. Live message delivery and privacy require connecting Supabase Realtime & RLS." />

      <div className="bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Conversation List */}
        <aside
          className={`md:col-span-4 border-b md:border-b-0 md:border-r border-[#E4E6F0] flex flex-col ${
            activeProfileId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="px-5 py-4 border-b border-[#E4E6F0] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#17243A]">
              Conversations ({visibleThreads.length})
            </h2>
            <span className="text-xs text-[#74798A] inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7256D9]" aria-hidden="true" />
              Matched only
            </span>
          </div>

          {visibleThreads.length === 0 ? (
            <div className="p-6 text-sm text-[#74798A] text-center my-auto">
              No active conversations. Mutually match with a profile in Discover to start a
              conversation.
            </div>
          ) : (
            <div className="divide-y divide-[#E4E6F0] overflow-y-auto">
              {visibleThreads.map((thread) => {
                const person = profileMap.get(thread.participantId);
                if (!person) return null;
                const lastMsg = thread.messages[thread.messages.length - 1];
                const isSelected = selectedThread?.id === thread.id;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => onSelectProfile(person.id)}
                    className={`w-full px-5 py-4 text-left flex items-start gap-3.5 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#EEE9FF]/60' : 'hover:bg-[#F4F5F8]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F4F5F8] border border-[#E4E6F0] shrink-0">
                      <SafeImage
                        src={person.photos[0] ?? ''}
                        alt={person.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#17243A] truncate">
                          {person.displayName}
                        </span>
                        {thread.unreadCount > 0 && (
                          <span className="text-xs font-mono tabular-nums font-semibold text-[#7256D9]">
                            {thread.unreadCount} new
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#74798A] truncate mt-0.5">
                        {lastMsg ? lastMsg.body : 'Start your conversation'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Chat Window */}
        <section
          className={`md:col-span-8 flex flex-col justify-between ${
            !activeProfileId && visibleThreads.length > 0 ? 'hidden md:flex' : 'flex'
          }`}
        >
          {!selectedThread || !selectedParticipant ? (
            <div className="p-8 text-center text-sm text-[#74798A] my-auto">
              Select a mutual match conversation to view messages.
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-[#E4E6F0] flex flex-wrap items-center justify-between gap-3 bg-[#FCFBFF]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectProfile(null)}
                    aria-label="Back to conversations"
                    className="md:hidden p-2 rounded-lg text-[#17243A] hover:bg-[#F4F5F8] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewProfile(selectedParticipant)}
                    className="flex items-center gap-3 text-left group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E4E6F0] shrink-0">
                      <SafeImage
                        src={selectedParticipant.photos[0] ?? ''}
                        alt={selectedParticipant.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#17243A] group-hover:text-[#7256D9] transition-colors">
                        {selectedParticipant.displayName}, {selectedParticipant.age}
                      </p>
                      <p className="text-xs text-[#74798A]">
                        {selectedParticipant.generalLocation} · View profile
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onReport(selectedParticipant.id)}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#74798A] hover:text-[#17243A] hover:bg-[#F4F5F8] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onBlock(selectedParticipant.id)}
                    className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#74798A] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Block</span>
                  </button>
                  {selectedMatch && (
                    <button
                      type="button"
                      onClick={() => onUnmatch(selectedMatch.id)}
                      className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#74798A] hover:text-[#B42318] hover:bg-[#FEF3F2] rounded-lg inline-flex items-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Unmatch</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto bg-[#FCFBFF]">
                {selectedThread.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  const timeLabel = new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[82%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? 'bg-[#7256D9] text-white'
                            : 'bg-[#F4F5F8] text-[#20243A] border border-[#E4E6F0]'
                        }`}
                      >
                        {msg.body}
                      </div>
                      <span className="mt-1 text-[11px] font-mono tabular-nums text-[#74798A]">
                        {timeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-[#E4E6F0] bg-white space-y-2"
              >
                {sendError && (
                  <p className="text-xs font-medium text-[#B42318]">{sendError}</p>
                )}
                <div className="flex items-center gap-2.5">
                  <input
                    type="text"
                    maxLength={2000}
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder={`Message ${selectedParticipant.displayName} (max 2,000 chars)...`}
                    className="flex-1 min-h-[44px] px-4 py-2.5 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-xl focus:outline-2 focus:outline-[#7256D9]"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl inline-flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#74798A]">
                  Protected by anti-spam rate limiting (max 12 messages/min) · Mutual matches only
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

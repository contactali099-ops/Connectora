import { useState, useMemo } from 'react';
import {
  AppRoute,
  ConnectionIntention,
  ConversationThread,
  DiscoverFilters,
  MatchRecord,
  ModerationActionRecord,
  PrivateUserProfile,
  PublicProfile,
  ReportReason,
  ReportStatus,
  SafetyReport,
} from './types/platform';
import {
  DEFAULT_DEMO_CURRENT_USER,
  DEMO_PROFILES,
  INITIAL_DEMO_CONVERSATIONS,
  INITIAL_DEMO_LIKES_RECEIVED,
  INITIAL_DEMO_LIKES_SENT,
  INITIAL_DEMO_MATCHES,
  INITIAL_DEMO_MOD_ACTIONS,
  INITIAL_DEMO_REPORTS,
} from './data/demoProfiles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { MatchesPage } from './pages/MatchesPage';
import { MessagesPage } from './pages/MessagesPage';
import { SafetyPage } from './pages/SafetyPage';
import { ModerationPage } from './pages/ModerationPage';
import { MembershipPage } from './pages/MembershipPage';
import { AboutFaqPage } from './pages/AboutFaqPage';
import { LegalPage } from './pages/LegalPage';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [currentUser, setCurrentUser] = useState<PrivateUserProfile | null>(null);
  const [profiles, setProfiles] = useState<PublicProfile[]>(DEMO_PROFILES);

  const [filters, setFilters] = useState<DiscoverFilters>({
    country: 'ALL',
    minAge: 18,
    maxAge: 65,
    intention: 'ALL',
    interest: '',
    language: '',
  });

  const [likedSentIds, setLikedSentIds] = useState<string[]>(INITIAL_DEMO_LIKES_SENT);
  const [likedReceivedIds] = useState<string[]>(INITIAL_DEMO_LIKES_RECEIVED);
  const [passedIds, setPassedIds] = useState<string[]>([]);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>(INITIAL_DEMO_MATCHES);
  const [conversations, setConversations] = useState<ConversationThread[]>(
    INITIAL_DEMO_CONVERSATIONS
  );

  const [reports, setReports] = useState<SafetyReport[]>(INITIAL_DEMO_REPORTS);
  const [modActions, setModActions] = useState<ModerationActionRecord[]>(INITIAL_DEMO_MOD_ACTIONS);

  const [inspectedProfile, setInspectedProfile] = useState<PublicProfile | null>(null);
  const [activeChatProfileId, setActiveChatProfileId] = useState<string | null>(null);
  const [preselectedReportProfileId, setPreselectedReportProfileId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sentMessageTimestamps, setSentMessageTimestamps] = useState<number[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const navigate = (nextRoute: AppRoute) => {
    if (nextRoute === 'how-it-works') {
      setRoute('home');
      setTimeout(() => {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return;
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreIntention = (intention: ConnectionIntention) => {
    setFilters((prev) => ({ ...prev, intention }));
    navigate('discover');
  };

  const activeMatchedProfileIds = useMemo(
    () =>
      matches
        .filter((m) => m.status === 'active' && !blockedIds.includes(m.profileId))
        .map((m) => m.profileId),
    [matches, blockedIds]
  );

  const unreadMessagesCount = useMemo(() => {
    if (!currentUser) return 0;
    return conversations
      .filter(
        (c) =>
          activeMatchedProfileIds.includes(c.participantId) &&
          !blockedIds.includes(c.participantId)
      )
      .reduce((acc, c) => acc + c.unreadCount, 0);
  }, [currentUser, conversations, activeMatchedProfileIds, blockedIds]);

  const handleLike = (profileId: string) => {
    if (blockedIds.includes(profileId)) return;

    if (!likedSentIds.includes(profileId)) {
      setLikedSentIds((prev) => [...prev, profileId]);
    }

    // Mutual match occurs ONLY when the other adult also liked the user, without duplicates
    const alreadyMatched = matches.some(
      (m) => m.profileId === profileId && m.status === 'active'
    );
    if (!alreadyMatched && likedReceivedIds.includes(profileId)) {
      const newMatchId = `match-${profileId}-${Date.now()}`;
      setMatches((prev) => [
        ...prev,
        {
          id: newMatchId,
          profileId,
          matchedAt: new Date().toISOString(),
          status: 'active',
        },
      ]);

      setConversations((prev) => {
        const exists = prev.some((c) => c.participantId === profileId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: `conv-${profileId}`,
            matchId: newMatchId,
            participantId: profileId,
            messages: [],
            unreadCount: 0,
          },
        ];
      });

      const target = profiles.find((p) => p.id === profileId);
      showToast(`Mutual match created with ${target?.displayName ?? 'member'}.`);
    } else {
      showToast('Interest sent. A match forms if they like you back.');
    }
  };

  const handlePass = (profileId: string) => {
    if (!passedIds.includes(profileId)) {
      setPassedIds((prev) => [...prev, profileId]);
    }
  };

  const handleWithdrawLike = (profileId: string) => {
    setLikedSentIds((prev) => prev.filter((id) => id !== profileId));
    showToast('Like withdrawn.');
  };

  const handleUnmatch = (matchId: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, status: 'unmatched' } : m))
    );
    showToast('Connection unmatched. Private messaging is now closed.');
  };

  const handleBlock = (profileId: string) => {
    if (blockedIds.includes(profileId)) {
      setBlockedIds((prev) => prev.filter((id) => id !== profileId));
      showToast('Account unblocked.');
      return;
    }

    setBlockedIds((prev) => [...prev, profileId]);
    setMatches((prev) =>
      prev.map((m) => (m.profileId === profileId ? { ...m, status: 'unmatched' } : m))
    );
    if (activeChatProfileId === profileId) {
      setActiveChatProfileId(null);
    }
    showToast('Account blocked and hidden from discovery and messaging.');
  };

  const handleOpenMessages = (profileId: string) => {
    setActiveChatProfileId(profileId);
    setConversations((prev) =>
      prev.map((c) => (c.participantId === profileId ? { ...c, unreadCount: 0 } : c))
    );
    navigate('messages');
  };

  const handleSendMessage = (
    conversationId: string,
    body: string
  ): { ok: boolean; error?: string } => {
    if (!currentUser) {
      return { ok: false, error: 'Sign in required.' };
    }

    const thread = conversations.find((c) => c.id === conversationId);
    if (!thread) {
      return { ok: false, error: 'Conversation not found.' };
    }

    const isMatched = matches.some(
      (m) => m.id === thread.matchId && m.status === 'active'
    );
    if (!isMatched || blockedIds.includes(thread.participantId)) {
      return { ok: false, error: 'Messaging is restricted to active, unblocked mutual matches.' };
    }

    const now = Date.now();
    const recent = sentMessageTimestamps.filter((ts) => now - ts < 60_000);
    if (recent.length >= 12) {
      return {
        ok: false,
        error: 'Anti-spam rate limit reached (12 messages per minute). Please wait briefly.',
      };
    }

    setSentMessageTimestamps([...recent, now]);
    const newMsg = {
      id: `msg-${now}`,
      conversationId,
      senderId: currentUser.id,
      body,
      createdAt: new Date(now).toISOString(),
      read: true,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );

    return { ok: true };
  };

  const handleSubmitReport = (payload: {
    reportedProfileId: string;
    reason: ReportReason;
    description: string;
    evidenceNote?: string;
  }) => {
    const target = profiles.find((p) => p.id === payload.reportedProfileId);
    const newReport: SafetyReport = {
      id: `RPT-2026-${Math.floor(110 + Math.random() * 880)}`,
      reporterLabel: currentUser ? `${currentUser.displayName} (Private)` : 'Member (Private)',
      reportedProfileId: payload.reportedProfileId,
      reportedDisplayName: target?.displayName ?? 'Reported Profile',
      reason: payload.reason,
      description: payload.description,
      evidenceNote: payload.evidenceNote,
      status: 'pending',
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    setReports((prev) => [newReport, ...prev]);
    showToast('Private moderation report submitted.');
  };

  const handleUpdateReportStatus = (reportId: string, status: ReportStatus, notes: string) => {
    const targetReport = reports.find((r) => r.id === reportId);
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));

    if (targetReport) {
      setModActions((prev) => [
        {
          id: `MOD-${Math.floor(900 + Math.random() * 99)}`,
          reportId,
          moderatorLabel: currentUser?.displayName ?? 'Moderator',
          targetProfileId: targetReport.reportedProfileId,
          targetDisplayName: targetReport.reportedDisplayName,
          actionType: 'status_changed',
          notes,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast(`Report ${reportId} marked ${status}.`);
    }
  };

  const handleToggleSuspendProfile = (profileId: string, suspend: boolean, notes: string) => {
    const target = profiles.find((p) => p.id === profileId);
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, status: suspend ? 'suspended' : 'active' } : p
      )
    );

    setModActions((prev) => [
      {
        id: `MOD-${Math.floor(900 + Math.random() * 99)}`,
        moderatorLabel: currentUser?.displayName ?? 'Moderator',
        targetProfileId: profileId,
        targetDisplayName: target?.displayName ?? profileId,
        actionType: suspend ? 'account_suspended' : 'account_restored',
        notes,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast(suspend ? 'Account suspended from discovery.' : 'Account restored.');
  };

  const handleDemoSignIn = (customProfile?: PrivateUserProfile) => {
    setCurrentUser(customProfile ?? DEFAULT_DEMO_CURRENT_USER);
    showToast(
      customProfile
        ? `Signed in to 18+ preview session as ${customProfile.displayName}.`
        : 'Entered Demo Adult Preview Session.'
    );
    navigate('discover');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('Signed out of session.');
    navigate('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBFF] text-[#20243A]">
      <Header
        currentRoute={route}
        onNavigate={navigate}
        currentUser={currentUser}
        unreadMessagesCount={unreadMessagesCount}
        onSignOut={handleSignOut}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#17243A] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-white/10"
        >
          {toastMessage}
        </div>
      )}

      <main className="flex-1">
        {route === 'home' && (
          <HomePage onNavigate={navigate} onExploreIntention={handleExploreIntention} />
        )}

        {route === 'discover' && (
          <DiscoverPage
            profiles={profiles}
            filters={filters}
            onFiltersChange={setFilters}
            likedIds={likedSentIds}
            passedIds={passedIds}
            matchedIds={activeMatchedProfileIds}
            blockedIds={blockedIds}
            onLike={handleLike}
            onPass={handlePass}
            onViewProfile={(p) => setInspectedProfile(p)}
          />
        )}

        {(route === 'login' || route === 'register') && (
          <AuthPage
            key={route}
            initialMode={route}
            onNavigate={navigate}
            onDemoSignIn={handleDemoSignIn}
          />
        )}

        {route === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateProfile={(updated) => setCurrentUser(updated)}
            onDeleteAccount={() => {
              setCurrentUser(null);
              showToast('Preview account removed.');
              navigate('home');
            }}
            onRequireAuth={() => navigate('login')}
          />
        )}

        {route === 'matches' && (
          <MatchesPage
            profiles={profiles}
            matches={matches}
            likedSentIds={likedSentIds}
            likedReceivedIds={likedReceivedIds}
            blockedIds={blockedIds}
            onLike={handleLike}
            onWithdrawLike={handleWithdrawLike}
            onUnmatch={handleUnmatch}
            onUnblock={handleBlock}
            onOpenMessages={handleOpenMessages}
            onViewProfile={(p) => setInspectedProfile(p)}
          />
        )}

        {route === 'messages' && (
          <MessagesPage
            currentUser={currentUser}
            profiles={profiles}
            matches={matches}
            conversations={conversations}
            blockedIds={blockedIds}
            activeProfileId={activeChatProfileId}
            onSelectProfile={(id) => {
              setActiveChatProfileId(id);
              if (id) {
                setConversations((prev) =>
                  prev.map((c) => (c.participantId === id ? { ...c, unreadCount: 0 } : c))
                );
              }
            }}
            onSendMessage={handleSendMessage}
            onViewProfile={(p) => setInspectedProfile(p)}
            onBlock={handleBlock}
            onReport={(id) => {
              setPreselectedReportProfileId(id);
              navigate('safety');
            }}
            onUnmatch={handleUnmatch}
            onRequireAuth={() => navigate('login')}
          />
        )}

        {route === 'safety' && (
          <SafetyPage
            profiles={profiles}
            preselectedReportProfileId={preselectedReportProfileId}
            onSubmitReport={handleSubmitReport}
            onNavigate={navigate}
          />
        )}

        {route === 'moderation' && (
          <ModerationPage
            currentUser={currentUser}
            profiles={profiles}
            reports={reports}
            actionsLog={modActions}
            onUpdateReportStatus={handleUpdateReportStatus}
            onToggleSuspendProfile={handleToggleSuspendProfile}
            onViewProfile={(p) => setInspectedProfile(p)}
            onRequireAuth={() => navigate('login')}
          />
        )}

        {route === 'membership' && <MembershipPage onNavigate={navigate} />}

        {route === 'about' && <AboutFaqPage onNavigate={navigate} />}

        {(route === 'contact' ||
          route === 'privacy' ||
          route === 'terms' ||
          route === 'guidelines' ||
          route === 'cookies') && <LegalPage route={route} onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />

      <ProfileDetailModal
        profile={inspectedProfile}
        isLiked={inspectedProfile ? likedSentIds.includes(inspectedProfile.id) : false}
        isMatched={
          inspectedProfile ? activeMatchedProfileIds.includes(inspectedProfile.id) : false
        }
        isBlocked={inspectedProfile ? blockedIds.includes(inspectedProfile.id) : false}
        onClose={() => setInspectedProfile(null)}
        onLike={handleLike}
        onPass={handlePass}
        onMessage={(id) => {
          setInspectedProfile(null);
          handleOpenMessages(id);
        }}
        onBlock={handleBlock}
        onReport={(id) => {
          setPreselectedReportProfileId(id);
          navigate('safety');
        }}
      />
    </div>
  );
}

export type CountryCode = 'US' | 'CA' | 'GB';

export type ConnectionIntention =
  | 'Friendship'
  | 'Social Connections'
  | 'Serious Relationships'
  | 'Life Partner';

export type AccountRole = 'member' | 'moderator' | 'admin';

export type AccountStatus = 'active' | 'suspended';

export type ReportReason =
  | 'Harassment'
  | 'Fake Profile / Impersonation'
  | 'Spam or Scam'
  | 'Underage Concern'
  | 'Inappropriate Content';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export type AppRoute =
  | 'home'
  | 'discover'
  | 'how-it-works'
  | 'safety'
  | 'about'
  | 'login'
  | 'register'
  | 'profile'
  | 'matches'
  | 'messages'
  | 'membership'
  | 'moderation'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'guidelines'
  | 'cookies';

export interface PublicProfile {
  id: string;
  displayName: string;
  age: number;
  countryCode: CountryCode;
  generalLocation: string;
  bio: string;
  interests: string[];
  languages: string[];
  intentions: ConnectionIntention[];
  photos: string[];
  isDemo: boolean;
  status: AccountStatus;
}

export interface PrivateUserProfile extends PublicProfile {
  email: string;
  dateOfBirth: string; // Stored privately; never displayed on public cards
  phoneNumber?: string;
  role: AccountRole;
  ageVerifiedMethod: 'dob_and_assurance';
  visibility: {
    showLocationPublic: boolean;
    showLanguagesPublic: boolean;
    showInDiscovery: boolean;
  };
}

export interface MatchRecord {
  id: string;
  profileId: string;
  matchedAt: string;
  status: 'active' | 'unmatched';
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  read: boolean;
}

export interface ConversationThread {
  id: string;
  matchId: string;
  participantId: string;
  messages: MessageItem[];
  unreadCount: number;
}

export interface SafetyReport {
  id: string;
  reporterLabel: string;
  reportedProfileId: string;
  reportedDisplayName: string;
  reason: ReportReason;
  description: string;
  evidenceNote?: string;
  status: ReportStatus;
  createdAt: string;
  isDemo: boolean;
}

export interface ModerationActionRecord {
  id: string;
  reportId?: string;
  moderatorLabel: string;
  targetProfileId: string;
  targetDisplayName: string;
  actionType: 'status_changed' | 'account_suspended' | 'account_restored' | 'warning_issued';
  notes: string;
  createdAt: string;
}

export interface DiscoverFilters {
  country: CountryCode | 'ALL';
  minAge: number;
  maxAge: number;
  intention: ConnectionIntention | 'ALL';
  interest: string;
  language: string;
}

import {
  ConversationThread,
  MatchRecord,
  ModerationActionRecord,
  PrivateUserProfile,
  PublicProfile,
  SafetyReport,
} from '../types/platform';

/**
 * Clearly labeled Sample Profiles (Demo).
 * These profiles are sample data to demonstrate Connectora's discovery,
 * matching, safety, and international market layout. Never presented as live members.
 */
export const DEMO_PROFILES: PublicProfile[] = [
  {
    id: 'demo-claire-bennett',
    displayName: 'Claire B.',
    age: 29,
    countryCode: 'US',
    generalLocation: 'Seattle, WA',
    bio: 'Architectural designer who spends Saturday mornings at neighborhood bakeries and afternoons hiking forest trails. Looking to meet thoughtful adults for genuine friendships or a long-term relationship built on curiosity.',
    interests: ['Architecture', 'Hiking', 'Coffee & Cafes', 'Photography'],
    languages: ['English', 'French'],
    intentions: ['Serious Relationships', 'Friendship'],
    photos: ['/src/assets/images/demo_portrait_claire_1795259326590.jpg'],
    isDemo: true,
    status: 'active',
  },
  {
    id: 'demo-marcus-reed',
    displayName: 'Marcus R.',
    age: 32,
    countryCode: 'US',
    generalLocation: 'Austin, TX',
    bio: 'Product lead and amateur jazz pianist. Recently relocated and hoping to expand my local social circle while remaining open to meeting someone for a serious relationship.',
    interests: ['Live Music', 'Cooking', 'Running', 'Independent Film'],
    languages: ['English', 'Spanish'],
    intentions: ['Social Connections', 'Serious Relationships'],
    photos: ['/src/assets/images/demo_portrait_marcus_1795259325082.jpg'],
    isDemo: true,
    status: 'active',
  },
  {
    id: 'demo-priya-nair',
    displayName: 'Priya N.',
    age: 27,
    countryCode: 'US',
    generalLocation: 'Chicago, IL',
    bio: 'Curator at a contemporary gallery who enjoys quiet museum Sundays, trying new vegetarian recipes, and deep conversations over pour-over coffee.',
    interests: ['Museums & Art', 'Cooking', 'Literature', 'Travel'],
    languages: ['English', 'Hindi'],
    intentions: ['Life Partner', 'Serious Relationships'],
    photos: ['/src/assets/images/demo_portrait_priya_1795259325804.jpg'],
    isDemo: true,
    status: 'active',
  },
  {
    id: 'demo-david-mercer',
    displayName: 'David M.',
    age: 35,
    countryCode: 'CA',
    generalLocation: 'Toronto, ON',
    bio: 'Urban planner and avid reader of natural history. Always glad to trade book recommendations, explore independent bookstores, or join a weekend cycling group.',
    interests: ['Literature', 'Cycling', 'Board Games', 'Coffee & Cafes'],
    languages: ['English', 'French'],
    intentions: ['Friendship', 'Life Partner'],
    photos: ['/src/assets/images/demo_portrait_david_1795259325441.jpg'],
    isDemo: true,
    status: 'active',
  },
  {
    id: 'demo-elena-brooks',
    displayName: 'Elena B.',
    age: 31,
    countryCode: 'GB',
    generalLocation: 'London',
    bio: 'Environmental researcher who loves rooftop gardening, independent cinema, and volunteering on community greening projects. Hoping to meet grounded people across borders.',
    interests: ['Independent Film', 'Volunteering', 'Hiking', 'Travel'],
    languages: ['English', 'Spanish'],
    intentions: ['Friendship', 'Social Connections'],
    photos: ['/src/assets/images/demo_portrait_elena_1795259326612.jpg'],
    isDemo: true,
    status: 'active',
  },
];

export const DEFAULT_DEMO_CURRENT_USER: PrivateUserProfile = {
  id: 'demo-signed-in-adult',
  displayName: 'Jordan Hayes',
  age: 30,
  dateOfBirth: '1996-05-14',
  email: 'demo-member@example.invalid',
  phoneNumber: '+1 (555) 234-5678',
  countryCode: 'US',
  generalLocation: 'Denver, CO',
  bio: 'Industrial designer who enjoys weekend trail walks, cooking with friends, and thoughtful conversation. Exploring Connectora in Demo Preview mode.',
  interests: ['Architecture', 'Cooking', 'Hiking', 'Independent Film'],
  languages: ['English', 'Spanish'],
  intentions: ['Friendship', 'Serious Relationships'],
  photos: ['/src/assets/images/hero_connection_lifestyle_1795259326232.jpg'],
  isDemo: true,
  status: 'active',
  role: 'moderator',
  ageVerifiedMethod: 'dob_and_assurance',
  visibility: {
    showLocationPublic: true,
    showLanguagesPublic: true,
    showInDiscovery: true,
  },
};

export const INITIAL_DEMO_LIKES_SENT = ['demo-claire-bennett', 'demo-priya-nair'];
export const INITIAL_DEMO_LIKES_RECEIVED = ['demo-claire-bennett', 'demo-marcus-reed'];

export const INITIAL_DEMO_MATCHES: MatchRecord[] = [
  {
    id: 'match-demo-claire',
    profileId: 'demo-claire-bennett',
    matchedAt: '2026-11-18T16:20:00Z',
    status: 'active',
  },
];

export const INITIAL_DEMO_CONVERSATIONS: ConversationThread[] = [
  {
    id: 'conv-demo-claire',
    matchId: 'match-demo-claire',
    participantId: 'demo-claire-bennett',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-demo-claire',
        senderId: 'demo-claire-bennett',
        body: 'Hi Jordan! I noticed we both enjoy architecture and weekend trail walks. Which neighborhood trails around Denver are your favorite?',
        createdAt: '2026-11-18T16:25:00Z',
        read: false,
      },
      {
        id: 'msg-2',
        conversationId: 'conv-demo-claire',
        senderId: 'demo-signed-in-adult',
        body: 'Hi Claire! Nice to match with you. I usually head out toward Golden or Bear Creek early on Sunday mornings.',
        createdAt: '2026-11-18T16:40:00Z',
        read: true,
      },
    ],
  },
];

export const INITIAL_DEMO_REPORTS: SafetyReport[] = [
  {
    id: 'RPT-2026-104',
    reporterLabel: 'Adult Member (Private)',
    reportedProfileId: 'demo-marcus-reed',
    reportedDisplayName: 'Sample Record — Review Test',
    reason: 'Spam or Scam',
    description: 'Sample moderation record demonstrating private queue review workflow. No real user infraction occurred.',
    evidenceNote: 'Demo moderation queue entry for administrator UI testing.',
    status: 'pending',
    createdAt: '2026-11-19T11:15:00Z',
    isDemo: true,
  },
  {
    id: 'RPT-2026-102',
    reporterLabel: 'Adult Member (Private)',
    reportedProfileId: 'demo-david-mercer',
    reportedDisplayName: 'Sample Record — Resolved Test',
    reason: 'Fake Profile / Impersonation',
    description: 'Sample resolved moderation record verifying audit trail logging.',
    status: 'resolved',
    createdAt: '2026-11-16T09:05:00Z',
    isDemo: true,
  },
];

export const INITIAL_DEMO_MOD_ACTIONS: ModerationActionRecord[] = [
  {
    id: 'MOD-881',
    reportId: 'RPT-2026-102',
    moderatorLabel: 'Authorized Moderator',
    targetProfileId: 'demo-david-mercer',
    targetDisplayName: 'Sample Record — Resolved Test',
    actionType: 'status_changed',
    notes: 'Sample audit entry: verified demo record marked resolved.',
    createdAt: '2026-11-16T10:12:00Z',
  },
];

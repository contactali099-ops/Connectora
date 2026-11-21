import { ArrowRight, ShieldCheck, Users, HeartHandshake, Lock, Sparkles } from 'lucide-react';
import { AppRoute, ConnectionIntention } from '../types/platform';
import { SafeImage } from '../components/SafeImage';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
  onExploreIntention: (intention: ConnectionIntention) => void;
}

export function HomePage({ onNavigate, onExploreIntention }: HomePageProps) {
  const steps = [
    {
      num: '01.',
      title: 'Create Your Profile',
      description:
        'Introduce yourself, add your interests, and share what kind of connections you are looking for.',
      icon: Users,
    },
    {
      num: '02.',
      title: 'Discover People',
      description:
        'Explore profiles and discover adults with shared interests and compatible intentions.',
      icon: Sparkles,
    },
    {
      num: '03.',
      title: 'Connect Meaningfully',
      description:
        'Like profiles, connect through mutual matches, and start conversations.',
      icon: HeartHandshake,
    },
  ];

  const categories: {
    title: ConnectionIntention;
    description: string;
    image?: string;
    imageAlt?: string;
  }[] = [
    {
      title: 'Friendship',
      description: 'Meet adults who share your interests and enjoy meaningful conversations.',
      image: '/src/assets/images/category_friendship_walk_1795259326022.jpg',
      imageAlt: 'Two adult friends talking while walking through a sunlit urban park',
    },
    {
      title: 'Social Connections',
      description: 'Expand your social circle and discover people with similar hobbies.',
    },
    {
      title: 'Serious Relationships',
      description: 'Discover compatible adults interested in genuine long-term relationships.',
      image: '/src/assets/images/category_relationship_dinner_1795259326025.jpg',
      imageAlt: 'Adult couple laughing while cooking dinner together in a bright kitchen',
    },
    {
      title: 'Life Partner',
      description: 'Connect with adults who are looking for a meaningful long-term commitment.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[#FCFBFF] border-b border-[#E4E6F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-sm font-medium text-[#7256D9]">
                Adults 18+ · Launching in the United States · International Ready
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#17243A] leading-[1.12] [text-wrap:balance]">
                Find Your People. Build Something Meaningful.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#74798A] max-w-xl">
                From new friendships to serious relationships, discover genuine connections with
                people who share your interests and values.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="min-h-[48px] px-6 py-3 text-sm sm:text-base font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl transition-colors inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7256D9]"
                >
                  <span>Join Connectora — It&apos;s Free</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('how-it-works-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigate('how-it-works');
                    }
                  }}
                  className="min-h-[48px] px-6 py-3 text-sm sm:text-base font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7256D9]"
                >
                  Explore How It Works
                </button>
              </div>

              <div className="pt-4 border-t border-[#E4E6F0] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#74798A]">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
                  18+ age eligibility enforced
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
                  Exact location &amp; DOB stay private
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col">
              <div className="flex-1 rounded-2xl overflow-hidden border border-[#E4E6F0] bg-[#F4F5F8] min-h-[300px] sm:min-h-[380px]">
                <SafeImage
                  src="/src/assets/images/hero_connection_lifestyle_1795259326232.jpg"
                  alt="Three adults having an engaging, friendly conversation over coffee in a sunlit cafe"
                  className="w-full h-full object-cover"
                  fallbackLabel="Connectora Adult Community"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#74798A]">
                <span>Real People. Genuine Connections. Better Relationships.</span>
                <span>Free to join at launch (USD)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works-section" className="bg-[#F4F5F8]/70 border-b border-[#E4E6F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl space-y-3 mb-12">
            <p className="text-sm font-semibold text-[#7256D9]">How Connectora Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17243A] [text-wrap:balance]">
              Three deliberate steps from discovery to genuine conversation.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-white border border-[#E4E6F0] rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-[#7256D9] tabular-nums">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#EEE9FF] flex items-center justify-center text-[#7256D9]">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-xl font-bold text-[#17243A]">{step.title}</h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#74798A]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Connection Categories Section */}
      <section className="bg-[#FCFBFF] border-b border-[#E4E6F0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold text-[#7256D9]">Connection Intentions (18+)</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17243A] [text-wrap:balance]">
                Clarity from the start, whether seeking friendship or a life partner.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('discover')}
              className="self-start md:self-auto min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#7256D9] hover:text-[#5E43C4] bg-[#EEE9FF]/70 hover:bg-[#EEE9FF] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Browse Sample Profiles</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Friendship (Featured photo card) */}
            <div className="md:col-span-7 bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-[#F4F5F8] border-b border-[#E4E6F0]">
                <SafeImage
                  src={categories[0].image!}
                  alt={categories[0].imageAlt!}
                  className="w-full h-full object-cover"
                  fallbackLabel="Friendship Connections"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#17243A]">
                    {categories[0].title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#74798A] leading-relaxed">
                    {categories[0].description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreIntention('Friendship')}
                  className="self-start text-sm font-semibold text-[#7256D9] hover:text-[#5E43C4] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Friendship</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Social Connections */}
            <div className="md:col-span-5 bg-[#EEE9FF]/45 border border-[#E4E6F0] rounded-2xl p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#7256D9]">18+ Adult Community</span>
                <h3 className="font-display text-2xl font-bold text-[#17243A]">
                  {categories[1].title}
                </h3>
                <p className="text-sm sm:text-base text-[#20243A]/80 leading-relaxed">
                  {categories[1].description}
                </p>
              </div>
              <div className="pt-4 border-t border-[#D9CEF9]/70 flex items-center justify-between">
                <span className="text-xs text-[#74798A]">Shared hobbies · Local &amp; cross-border</span>
                <button
                  type="button"
                  onClick={() => onExploreIntention('Social Connections')}
                  className="text-sm font-semibold text-[#7256D9] hover:text-[#5E43C4] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Life Partner */}
            <div className="md:col-span-5 bg-[#17243A] text-white rounded-2xl p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#F18AA8]">18+ Adult Community</span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {categories[3].title}
                </h3>
                <p className="text-sm sm:text-base text-[#C7CDD9] leading-relaxed">
                  {categories[3].description}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#9AA3B5]">Mutual matching · Private messaging</span>
                <button
                  type="button"
                  onClick={() => onExploreIntention('Life Partner')}
                  className="text-sm font-semibold text-[#F18AA8] hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Serious Relationships (Featured photo card) */}
            <div className="md:col-span-7 bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-[#F4F5F8] border-b border-[#E4E6F0]">
                <SafeImage
                  src={categories[2].image!}
                  alt={categories[2].imageAlt!}
                  className="w-full h-full object-cover"
                  fallbackLabel="Serious Relationships"
                />
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-[#17243A]">
                    {categories[2].title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#74798A] leading-relaxed">
                    {categories[2].description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onExploreIntention('Serious Relationships')}
                  className="self-start text-sm font-semibold text-[#7256D9] hover:text-[#5E43C4] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Serious Relationships</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety, Privacy & Free Launch Promise */}
      <section className="bg-[#F4F5F8]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="bg-white border border-[#E4E6F0] rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-sm font-semibold text-[#7256D9]">Trust &amp; Safety Architecture</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#17243A] [text-wrap:balance]">
                Built around consent, 18+ eligibility, and private communication.
              </h2>
              <p className="text-sm sm:text-base text-[#74798A] leading-relaxed">
                Connectora launches with a free membership plan in the United States while keeping
                your date of birth, email, and exact address hidden from public profiles. Conversations
                open only after both adults express mutual interest.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('safety')}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#17243A] hover:bg-[#233554] rounded-xl transition-colors cursor-pointer"
                >
                  Visit Safety Center
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('membership')}
                  className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] border border-[#E4E6F0] rounded-xl transition-colors cursor-pointer"
                >
                  View Free Launch Plan
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-[#E4E6F0] pt-6 lg:pt-0 lg:pl-8">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#17243A]">Strictly 18+ Adults Only</h3>
                <p className="text-sm text-[#74798A]">
                  Date-of-birth checks and age-assurance confirmation block underage signups.
                </p>
              </div>
              <div className="space-y-1 pt-3 border-t border-[#E4E6F0]">
                <h3 className="text-sm font-bold text-[#17243A]">Mutual-Interest Messaging</h3>
                <p className="text-sm text-[#74798A]">
                  No unsolicited DMs. Only mutually matched, unblocked adults can message.
                </p>
              </div>
              <div className="space-y-1 pt-3 border-t border-[#E4E6F0]">
                <h3 className="text-sm font-bold text-[#17243A]">Private Moderation Queue</h3>
                <p className="text-sm text-[#74798A]">
                  Reports are confidentially reviewed by authorized moderators—never shown publicly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

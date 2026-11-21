import { useMemo, useState } from 'react';
import { Heart, X, Eye, SlidersHorizontal, RotateCcw, MapPin } from 'lucide-react';
import {
  ConnectionIntention,
  CountryCode,
  DiscoverFilters,
  PublicProfile,
} from '../types/platform';
import { ALL_INTERESTS, ALL_LANGUAGES, COUNTRY_LIST, SUPPORTED_COUNTRIES } from '../data/countries';
import { SafeImage } from '../components/SafeImage';
import { PreviewModeBanner } from '../components/PreviewModeBanner';

interface DiscoverPageProps {
  profiles: PublicProfile[];
  filters: DiscoverFilters;
  onFiltersChange: (next: DiscoverFilters) => void;
  likedIds: string[];
  passedIds: string[];
  matchedIds: string[];
  blockedIds: string[];
  onLike: (profileId: string) => void;
  onPass: (profileId: string) => void;
  onViewProfile: (profile: PublicProfile) => void;
}

const INTENTIONS: (ConnectionIntention | 'ALL')[] = [
  'ALL',
  'Friendship',
  'Social Connections',
  'Serious Relationships',
  'Life Partner',
];

export function DiscoverPage({
  profiles,
  filters,
  onFiltersChange,
  likedIds,
  passedIds,
  matchedIds,
  blockedIds,
  onLike,
  onPass,
  onViewProfile,
}: DiscoverPageProps) {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (profile.status !== 'active') return false;
      if (profile.age < 18) return false;
      if (blockedIds.includes(profile.id)) return false;
      if (passedIds.includes(profile.id)) return false;
      if (filters.country !== 'ALL' && profile.countryCode !== filters.country) return false;
      if (profile.age < filters.minAge || profile.age > filters.maxAge) return false;
      if (filters.intention !== 'ALL' && !profile.intentions.includes(filters.intention)) {
        return false;
      }
      if (filters.interest && !profile.interests.includes(filters.interest)) return false;
      if (filters.language && !profile.languages.includes(filters.language)) return false;
      return true;
    });
  }, [profiles, filters, blockedIds, passedIds]);

  const resetFilters = () => {
    onFiltersChange({
      country: 'ALL',
      minAge: 18,
      maxAge: 65,
      intention: 'ALL',
      interest: '',
      language: '',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#7256D9]">Discover Adults 18+</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#17243A] tracking-tight">
            Explore Sample Profiles
          </h1>
          <p className="text-sm sm:text-base text-[#74798A] max-w-2xl">
            Filter by country, adult age range, shared interests, languages, and connection
            intentions. Only general metro locations are shown—never exact addresses.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFiltersMobile((prev) => !prev)}
          className="md:hidden min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#17243A] bg-white border border-[#E4E6F0] rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#7256D9]" aria-hidden="true" />
          <span>{showFiltersMobile ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <PreviewModeBanner contextNote="Profiles shown below are clearly labeled Sample Profiles (Demo) for design and workflow evaluation. Connect Supabase to load real verified 18+ member profiles." />

      {/* Filter Toolbar */}
      <section
        aria-label="Discovery filters"
        className={`bg-white border border-[#E4E6F0] rounded-2xl p-5 sm:p-6 space-y-5 ${
          showFiltersMobile ? 'block' : 'hidden md:block'
        }`}
      >
        {/* Segmented Intention Tabs */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#74798A]">Connection Intention</span>
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4F5F8] rounded-xl">
            {INTENTIONS.map((item) => {
              const active = filters.intention === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, intention: item })}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-white text-[#17243A] shadow-xs font-semibold'
                      : 'text-[#74798A] hover:text-[#17243A]'
                  }`}
                >
                  {item === 'ALL' ? 'All Intentions' : item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="filter-country" className="block text-xs font-semibold text-[#74798A] mb-1.5">
              Country
            </label>
            <select
              id="filter-country"
              value={filters.country}
              onChange={(e) =>
                onFiltersChange({ ...filters, country: e.target.value as CountryCode | 'ALL' })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-lg text-[#20243A] focus:outline-2 focus:outline-[#7256D9]"
            >
              <option value="ALL">All Countries (US, CA, UK)</option>
              {COUNTRY_LIST.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-min-age" className="block text-xs font-semibold text-[#74798A] mb-1.5">
              Min Age (18+)
            </label>
            <select
              id="filter-min-age"
              value={filters.minAge}
              onChange={(e) => {
                const nextMin = Math.max(18, Number(e.target.value));
                onFiltersChange({
                  ...filters,
                  minAge: nextMin,
                  maxAge: Math.max(nextMin, filters.maxAge),
                });
              }}
              className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-lg text-[#20243A] tabular-nums focus:outline-2 focus:outline-[#7256D9]"
            >
              {[18, 21, 25, 30, 35, 40, 50].map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-max-age" className="block text-xs font-semibold text-[#74798A] mb-1.5">
              Max Age
            </label>
            <select
              id="filter-max-age"
              value={filters.maxAge}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  maxAge: Math.max(filters.minAge, Number(e.target.value)),
                })
              }
              className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-lg text-[#20243A] tabular-nums focus:outline-2 focus:outline-[#7256D9]"
            >
              {[25, 30, 35, 40, 50, 60, 65, 80].map((age) => (
                <option key={age} value={age}>
                  {age === 80 ? '65+' : age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-interest" className="block text-xs font-semibold text-[#74798A] mb-1.5">
              Interest
            </label>
            <select
              id="filter-interest"
              value={filters.interest}
              onChange={(e) => onFiltersChange({ ...filters, interest: e.target.value })}
              className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-lg text-[#20243A] focus:outline-2 focus:outline-[#7256D9]"
            >
              <option value="">Any Interest</option>
              {ALL_INTERESTS.map((interest) => (
                <option key={interest} value={interest}>
                  {interest}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-language" className="block text-xs font-semibold text-[#74798A] mb-1.5">
              Language
            </label>
            <select
              id="filter-language"
              value={filters.language}
              onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
              className="w-full min-h-[42px] px-3 py-2 text-sm bg-[#FCFBFF] border border-[#E4E6F0] rounded-lg text-[#20243A] focus:outline-2 focus:outline-[#7256D9]"
            >
              <option value="">Any Language</option>
              {ALL_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E4E6F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#74798A]">
          <span className="tabular-nums">
            Showing {filteredProfiles.length} sample adult {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
          </span>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 font-semibold text-[#7256D9] hover:text-[#5E43C4] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        </div>
      </section>

      {/* Profiles Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white border border-[#E4E6F0] rounded-2xl p-12 text-center space-y-4">
          <h2 className="font-display text-xl font-bold text-[#17243A]">
            No sample profiles match these filters
          </h2>
          <p className="text-sm text-[#74798A] max-w-md mx-auto">
            Try widening your country, age range, or intention filters to explore more sample adult
            profiles.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#7256D9] hover:bg-[#5E43C4] rounded-xl cursor-pointer"
          >
            Reset Discovery Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const country = SUPPORTED_COUNTRIES[profile.countryCode];
            const isLiked = likedIds.includes(profile.id);
            const isMatched = matchedIds.includes(profile.id);

            return (
              <article
                key={profile.id}
                className="bg-white border border-[#E4E6F0] rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div>
                  <div className="aspect-[4/4.2] bg-[#F4F5F8] border-b border-[#E4E6F0]">
                    <SafeImage
                      src={profile.photos[0] ?? ''}
                      alt={`${profile.displayName} sample profile portrait`}
                      className="w-full h-full object-cover"
                      fallbackLabel={profile.displayName}
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-[#74798A]">
                      <span>{profile.isDemo ? 'Sample Profile (Demo)' : 'Verified Adult 18+'}</span>
                      <span>
                        {country.flag} {country.name}
                      </span>
                    </div>

                    <div>
                      <h2 className="font-display text-xl font-bold text-[#17243A] tabular-nums">
                        {profile.displayName}, {profile.age}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#74798A] inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{profile.generalLocation}</span>
                      </p>
                    </div>

                    <p className="text-xs font-semibold text-[#7256D9]">
                      {profile.intentions.join(' · ')}
                    </p>

                    <p className="text-sm text-[#20243A] leading-relaxed line-clamp-3">
                      {profile.bio}
                    </p>

                    <p className="text-xs text-[#74798A] pt-1">
                      {profile.interests.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-[#E4E6F0] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onViewProfile(profile)}
                    className="flex-1 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-semibold text-[#17243A] bg-[#F4F5F8] hover:bg-[#EEE9FF] rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span>View Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLike(profile.id)}
                    disabled={isLiked || isMatched}
                    aria-label={isMatched ? 'Matched' : isLiked ? 'Interest sent' : `Like ${profile.displayName}`}
                    className={`min-h-[44px] px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isMatched
                        ? 'bg-[#EEE9FF] text-[#7256D9] cursor-default'
                        : isLiked
                          ? 'bg-[#EEE9FF] text-[#7256D9] cursor-default'
                          : 'bg-[#7256D9] hover:bg-[#5E43C4] text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" aria-hidden="true" />
                    <span>{isMatched ? 'Matched' : isLiked ? 'Liked' : 'Like'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onPass(profile.id)}
                    aria-label={`Pass on ${profile.displayName}`}
                    className="min-h-[44px] min-w-[44px] p-2 text-[#74798A] hover:text-[#17243A] bg-[#F4F5F8] hover:bg-[#E4E6F0] rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

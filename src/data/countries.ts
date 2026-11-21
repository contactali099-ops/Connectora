import { CountryCode } from '../types/platform';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  dialCode: string;
  phonePlaceholder: string;
  marketStatus: 'Launch Market' | 'Future Expansion Ready';
  currency: 'USD' | 'CAD' | 'GBP';
  sampleRegions: string[];
}

export const SUPPORTED_COUNTRIES: Record<CountryCode, CountryConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    dialCode: '+1',
    phonePlaceholder: '(555) 234-5678',
    marketStatus: 'Launch Market',
    currency: 'USD',
    sampleRegions: ['Seattle, WA', 'Austin, TX', 'Chicago, IL', 'Boston, MA', 'Denver, CO', 'New York, NY'],
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    dialCode: '+1',
    phonePlaceholder: '(416) 555-0192',
    marketStatus: 'Future Expansion Ready',
    currency: 'CAD',
    sampleRegions: ['Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Ottawa, ON'],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    dialCode: '+44',
    phonePlaceholder: '07700 900123',
    marketStatus: 'Future Expansion Ready',
    currency: 'GBP',
    sampleRegions: ['London', 'Manchester', 'Edinburgh', 'Bristol'],
  },
};

export const COUNTRY_LIST: CountryConfig[] = Object.values(SUPPORTED_COUNTRIES);

export const ALL_INTERESTS = [
  'Architecture',
  'Coffee & Cafes',
  'Hiking',
  'Independent Film',
  'Literature',
  'Cooking',
  'Live Music',
  'Photography',
  'Museums & Art',
  'Running',
  'Travel',
  'Volunteering',
  'Board Games',
  'Cycling',
];

export const ALL_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'Mandarin',
  'Hindi',
  'German',
  'Portuguese',
];

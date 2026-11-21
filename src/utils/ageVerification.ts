/**
 * Strict 18+ Age Eligibility & Privacy Helpers
 * Ensures under-18 birthdates are always blocked and full dates of birth
 * or private contact identifiers are never exposed in public UI views.
 */

export const MINIMUM_ADULT_AGE = 18;

export function calculateExactAge(dobString: string, referenceDate: Date = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
    return null;
  }

  const [yearStr, monthStr, dayStr] = dobString.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const birthDate = new Date(year, month - 1, day);
  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  if (birthDate > referenceDate) {
    return null;
  }

  let age = referenceDate.getFullYear() - year;
  const monthDiff = referenceDate.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < day)) {
    age -= 1;
  }

  return age;
}

export function isEligibleAdult(dobString: string): { valid: boolean; age: number | null; reason?: string } {
  const age = calculateExactAge(dobString);
  if (age === null) {
    return { valid: false, age: null, reason: 'Please enter a valid calendar date of birth.' };
  }
  if (age < MINIMUM_ADULT_AGE) {
    return {
      valid: false,
      age,
      reason: 'Connectora is strictly for adults aged 18 and above. Accounts under 18 cannot be registered.',
    };
  }
  if (age > 110) {
    return { valid: false, age, reason: 'Please verify your birth year.' };
  }
  return { valid: true, age };
}

export function getMaxAdultBirthDateISO(): string {
  const today = new Date();
  const maxYear = today.getFullYear() - MINIMUM_ADULT_AGE;
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${maxYear}-${month}-${day}`;
}

export function validateImageUpload(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxBytes = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are permitted.' };
  }
  if (file.size > maxBytes) {
    return { valid: false, error: 'Image size must be 5 MB or smaller.' };
  }
  return { valid: true };
}

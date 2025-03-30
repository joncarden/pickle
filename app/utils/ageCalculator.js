import { differenceInDays } from 'date-fns';

// Pickle's birth date - January 7, 2025
const PICKLE_BIRTH_DATE = new Date('2025-01-07');

/**
 * Calculate Pickle's age in weeks
 * @returns {number} Pickle's age in weeks (rounded down)
 */
export const getPickleAgeInWeeks = () => {
  const today = new Date();
  const diffInDays = differenceInDays(today, PICKLE_BIRTH_DATE);
  return Math.floor(diffInDays / 7);
};

/**
 * Get the appropriate age range based on Pickle's current age in weeks
 * @returns {string} Age range (e.g., "10-12", "13-16", etc.)
 */
export const getPickleAgeRange = () => {
  const ageInWeeks = getPickleAgeInWeeks();
  
  if (ageInWeeks < 10) {
    // App is designed for 10+ weeks, but we'll default to the earliest range
    return "10-12";
  } else if (ageInWeeks <= 12) {
    return "10-12";
  } else if (ageInWeeks <= 16) {
    return "13-16";
  } else if (ageInWeeks <= 20) {
    return "17-20";
  } else {
    return "21-26";
  }
};

/**
 * Format Pickle's age for display
 * @returns {string} Formatted age string
 */
export const getFormattedPickleAge = () => {
  const ageInWeeks = getPickleAgeInWeeks();
  return `${ageInWeeks} weeks`;
}; 
import { getPickleAgeRange } from './ageCalculator';
import pickleData from '../data/pickle-guidance.json';

/**
 * Get guidance data for Pickle's current age
 * @param {string} category - Optional: specific category to get (feeding, crate, potty)
 * @returns {Object} Guidance data for Pickle's current age
 */
export const getGuidanceForCurrentAge = (category = null) => {
  const ageRange = getPickleAgeRange();
  const ageData = pickleData.ages[ageRange];
  
  if (category && ageData[category]) {
    return ageData[category];
  }
  
  return ageData;
};

/**
 * Get schedule template for Pickle's current age
 * @returns {Object} Schedule template
 */
export const getScheduleTemplate = () => {
  const ageRange = getPickleAgeRange();
  return pickleData.scheduleTemplates[ageRange];
};

/**
 * Get daily schedule for Pickle's current age
 * @param {string} dayType - Optional: 'weekday' or 'weekend' (defaults to weekday)
 * @returns {Array} Daily schedule activities
 */
export const getDailySchedule = (dayType = 'weekday') => {
  const ageRange = getPickleAgeRange();
  const ageData = pickleData.ages[ageRange];
  
  // Check if daily schedule exists for current age
  if (ageData && ageData.dailySchedule && ageData.dailySchedule[dayType]) {
    return ageData.dailySchedule[dayType];
  }
  
  // Fallback to general schedule template if detailed schedule not available
  return [];
};

/**
 * Get a random tip from the specified category for Pickle's current age
 * @param {string} category - Category to get tip from (feeding, crate, potty)
 * @returns {string} Random tip from the category
 */
export const getRandomTip = (category) => {
  const guidance = getGuidanceForCurrentAge(category);
  
  if (!guidance || !guidance.tips) {
    // If no specific tips array, try to extract from techniques
    if (guidance && guidance.techniques) {
      const allSteps = guidance.techniques.flatMap(technique => technique.steps);
      if (allSteps.length > 0) {
        return allSteps[Math.floor(Math.random() * allSteps.length)];
      }
    }
    return "Remember to be consistent with Pickle's training!";
  }
  
  return guidance.tips[Math.floor(Math.random() * guidance.tips.length)];
};

/**
 * Get specific activity tips based on activity type
 * @param {string} activityType - Type of activity (potty, feeding, crate, etc)
 * @returns {string[]} Array of tips for the activity
 */
export const getActivityTips = (activityType) => {
  const scheduleTemplate = getScheduleTemplate();
  
  // Find matching activity in template
  const activity = scheduleTemplate.activities.find(a => a.type === activityType);
  
  if (activity && activity.tips) {
    return activity.tips;
  }
  
  // Fallback to category guidance
  const category = activityTypeToCategory(activityType);
  const guidance = getGuidanceForCurrentAge(category);
  
  if (guidance && guidance.tips) {
    return guidance.tips;
  }
  
  return ["Remember to be consistent with Pickle's routine!"];
};

/**
 * Convert activity type to guidance category
 * @param {string} activityType - Activity type from schedule
 * @returns {string} Category in guidance data
 */
const activityTypeToCategory = (activityType) => {
  const mapping = {
    'feeding': 'feeding',
    'meal': 'feeding',
    'crate': 'crate',
    'rest': 'crate',
    'potty': 'potty',
  };
  
  return mapping[activityType] || null;
};

/**
 * Map activity name from daily schedule to activity type
 * @param {string} activityName - Activity name from daily schedule
 * @returns {string} Activity type
 */
export const mapActivityNameToType = (activityName) => {
  const activityName_lower = activityName.toLowerCase();
  
  if (activityName_lower.includes('potty') || activityName_lower.includes('elimination')) {
    return 'potty';
  } else if (activityName_lower.includes('meal') || activityName_lower.includes('food') || activityName_lower.includes('feed')) {
    return 'meal';
  } else if (activityName_lower.includes('crate') || activityName_lower.includes('nap') || activityName_lower.includes('rest') || activityName_lower.includes('sleep') || activityName_lower.includes('bedtime')) {
    return 'rest';
  } else if (activityName_lower.includes('play') || activityName_lower.includes('exercise')) {
    return 'play';
  } else if (activityName_lower.includes('train') || activityName_lower.includes('session')) {
    return 'training';
  }
  
  return 'other';
}; 
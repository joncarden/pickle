import { getPickleAgeRange } from './ageCalculator';
import pickleData from '../data/pickle-guidance.json';

/**
 * Get guidance data for Pickle's current age
 * @param {string} category - Optional: specific category to get (feeding, crate, potty)
 * @returns {Object} Guidance data for Pickle's current age
 */
export const getGuidanceForCurrentAge = (category = null) => {
  // With the new structure, we now use feedingInfo, crateGuidance, and pottyGuidance directly
  const mapping = {
    'feeding': 'feedingInfo',
    'crate': 'crateGuidance',
    'potty': 'pottyGuidance'
  };
  
  const categoryKey = mapping[category] || null;
  
  if (categoryKey && pickleData[categoryKey]) {
    return pickleData[categoryKey];
  }
  
  return pickleData;
};

/**
 * Get schedule template for Pickle's current age
 * @returns {Object} Schedule template
 */
export const getScheduleTemplate = () => {
  // In the new structure, we create a template from the guidance info
  return {
    pottyFrequency: 2, // Default to every 2 hours
    mealTimes: ["6:45 AM", "11:30 AM", "6:35 PM"],
    activities: [
      {
        type: 'potty',
        duration: 5,
        frequency: pickleData.pottyGuidance?.frequency || "every 1-2 hours",
        tips: ["Take outside immediately after meals", "Reward after success"]
      },
      {
        type: 'meal',
        duration: 15,
        frequency: `${pickleData.feedingInfo?.meals || 3}x daily`,
        tips: [pickleData.feedingInfo?.handFeeding || "Hand-feed when possible"]
      },
      {
        type: 'rest',
        duration: 60,
        frequency: "multiple times daily",
        tips: [pickleData.crateGuidance?.toys || "Provide appropriate toys"]
      }
    ]
  };
};

/**
 * Get daily schedule for Pickle's current age
 * @param {string} dayType - Optional: 'weekday' or 'weekend' (defaults to weekday)
 * @returns {Array} Daily schedule activities
 */
export const getDailySchedule = (dayType = 'weekday') => {
  // In the new structure, dailySchedule is at the root level
  if (pickleData.dailySchedule && pickleData.dailySchedule.length > 0) {
    return pickleData.dailySchedule;
  }
  
  // Fallback to empty array if no schedule
  return [];
};

/**
 * Get a random tip from the specified category for Pickle's current age
 * @param {string} category - Category to get tip from (feeding, crate, potty)
 * @returns {string} Random tip from the category
 */
export const getRandomTip = (category) => {
  const guidance = getGuidanceForCurrentAge(category);
  
  // The new structure has different fields, so we need to check what's available
  if (category === 'feeding' && guidance) {
    return guidance.handFeeding || "Remember to be consistent with Pickle's feeding!";
  } else if (category === 'crate' && guidance) {
    return guidance.toys || "Make crate time positive with appropriate toys!";
  } else if (category === 'potty' && guidance) {
    return guidance.frequency || "Take Pickle out frequently for potty breaks!";
  }
  
  return "Remember to be consistent with Pickle's training!";
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
  
  if (category === 'feeding') {
    return [pickleData.feedingInfo?.handFeeding || "Feed consistently"];
  } else if (category === 'crate') {
    return [pickleData.crateGuidance?.duration || "Use crate for rest periods"];
  } else if (category === 'potty') {
    return [pickleData.pottyGuidance?.frequency || "Take out regularly"];
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
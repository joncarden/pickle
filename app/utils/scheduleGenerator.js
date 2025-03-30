import { getScheduleTemplate } from './dataAccess';
import { format, addHours, addMinutes, parse, isAfter } from 'date-fns';

// Activity types
const ACTIVITY_TYPES = {
  POTTY: 'potty',
  MEAL: 'meal',
  CRATE: 'crate',
  REST: 'rest',
  PLAY: 'play',
  TRAINING: 'training'
};

/**
 * Generate a daily schedule based on questionnaire responses
 * @param {Object} responses - Questionnaire responses
 * @returns {Array} Generated schedule for the day
 */
export const generateSchedule = (responses) => {
  const template = getScheduleTemplate();
  const now = new Date();
  const schedule = [];
  
  // Get potty frequency based on age
  const pottyFrequency = template.pottyFrequency; // Hours between potty breaks
  
  // Determine if immediate potty needed based on questionnaire
  const needsImmediatePotty = responses.potty === 'no';
  
  // Current time rounded to the nearest 15 minutes
  const currentTime = new Date(Math.round(now.getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000));
  let nextTime = new Date(currentTime);
  
  // Add immediate potty if needed
  if (needsImmediatePotty) {
    schedule.push({
      time: format(nextTime, 'h:mm a'),
      rawTime: new Date(nextTime),
      title: 'Potty Break',
      type: ACTIVITY_TYPES.POTTY,
      completed: false,
      isNext: true
    });
    
    nextTime = addMinutes(nextTime, 15);
  }
  
  // Determine next meal based on questionnaire
  let nextMealTime = null;
  
  if (responses.lastMeal === 'recent') {
    // If recently fed, schedule next meal based on template
    const mealTimes = template.mealTimes;
    
    // Find the next meal time that hasn't passed yet
    for (const mealTimeStr of mealTimes) {
      const [hour, minute] = mealTimeStr.split(':');
      const mealTime = new Date(now);
      mealTime.setHours(parseInt(hour, 10), parseInt(minute.split(' ')[0], 10), 0);
      
      // If this meal time is in the future, use it
      if (isAfter(mealTime, addHours(now, 2))) {
        nextMealTime = mealTime;
        break;
      }
    }
    
    // If no future meal time found, use the first meal time tomorrow
    if (!nextMealTime && mealTimes.length > 0) {
      const [hour, minute] = mealTimes[0].split(':');
      nextMealTime = new Date(now);
      nextMealTime.setHours(parseInt(hour, 10), parseInt(minute.split(' ')[0], 10), 0);
      // Set to tomorrow
      nextMealTime.setDate(nextMealTime.getDate() + 1);
    }
  } else if (responses.lastMeal === 'medium') {
    // If meal was 1-3 hours ago, schedule next meal in 2-3 hours
    nextMealTime = addHours(now, 2);
  } else {
    // If meal was more than 3 hours ago, schedule meal soon
    nextMealTime = addMinutes(nextTime, 30);
  }
  
  // Add next meal to schedule if it's today
  if (nextMealTime && nextMealTime.getDate() === now.getDate()) {
    schedule.push({
      time: format(nextMealTime, 'h:mm a'),
      rawTime: new Date(nextMealTime),
      title: 'Meal Time',
      type: ACTIVITY_TYPES.MEAL,
      completed: false,
      isNext: schedule.length === 0
    });
    
    // Schedule potty break 30 minutes after meal
    const postMealPotty = addMinutes(nextMealTime, 30);
    schedule.push({
      time: format(postMealPotty, 'h:mm a'),
      rawTime: new Date(postMealPotty),
      title: 'Potty Break (after meal)',
      type: ACTIVITY_TYPES.POTTY,
      completed: false,
      isNext: false
    });
  }
  
  // Determine if we need a nap/crate time based on questionnaire
  let nextNapTime = null;
  
  if (responses.lastNap === 'recent') {
    // Just woke up, schedule next nap in 1.5-2 hours
    nextNapTime = addHours(now, 2);
  } else if (responses.lastNap === 'medium') {
    // 30-90 minutes ago, schedule nap in 1 hour
    nextNapTime = addHours(now, 1);
  } else {
    // More than 90 minutes, schedule nap soon, especially if energy is high
    nextNapTime = responses.energy === 'high' 
      ? addMinutes(now, 30) 
      : addHours(now, 0.5);
  }
  
  // Add nap to schedule
  schedule.push({
    time: format(nextNapTime, 'h:mm a'),
    rawTime: new Date(nextNapTime),
    title: 'Crate Rest',
    type: ACTIVITY_TYPES.REST,
    duration: '60-90 min',
    completed: false,
    isNext: schedule.length === 0
  });
  
  // Schedule potty break after nap
  const napDuration = responses.energy === 'high' ? 60 : 90;
  const postNapTime = addMinutes(nextNapTime, napDuration);
  
  schedule.push({
    time: format(postNapTime, 'h:mm a'),
    rawTime: new Date(postNapTime),
    title: 'Potty Break (after nap)',
    type: ACTIVITY_TYPES.POTTY,
    completed: false,
    isNext: false
  });
  
  // Add play or training based on energy level
  if (responses.energy === 'high' || responses.energy === 'medium') {
    const playTime = addMinutes(postNapTime, 15);
    schedule.push({
      time: format(playTime, 'h:mm a'),
      rawTime: new Date(playTime),
      title: responses.energy === 'high' ? 'Play Session' : 'Training Session (5-10 min)',
      type: responses.energy === 'high' ? ACTIVITY_TYPES.PLAY : ACTIVITY_TYPES.TRAINING,
      completed: false,
      isNext: false
    });
  }
  
  // Generate remaining schedule until bedtime (9:30 PM)
  let currentScheduleTime = new Date(Math.max(...schedule.map(item => item.rawTime)));
  const bedTime = new Date(now);
  bedTime.setHours(21, 30, 0);
  
  while (currentScheduleTime < bedTime) {
    // Add potty breaks every X hours based on age
    const nextPottyTime = addHours(currentScheduleTime, pottyFrequency);
    
    if (nextPottyTime < bedTime) {
      schedule.push({
        time: format(nextPottyTime, 'h:mm a'),
        rawTime: new Date(nextPottyTime),
        title: 'Potty Break',
        type: ACTIVITY_TYPES.POTTY,
        completed: false,
        isNext: false
      });
      
      // Add some activity after potty
      const postPottyTime = addMinutes(nextPottyTime, 15);
      
      // Alternate between rest, play, and training
      const activities = [
        { title: 'Play Session', type: ACTIVITY_TYPES.PLAY },
        { title: 'Training Session (5-10 min)', type: ACTIVITY_TYPES.TRAINING },
        { title: 'Family Time', type: ACTIVITY_TYPES.PLAY }
      ];
      
      const activity = activities[schedule.length % activities.length];
      
      schedule.push({
        time: format(postPottyTime, 'h:mm a'),
        rawTime: new Date(postPottyTime),
        title: activity.title,
        type: activity.type,
        completed: false,
        isNext: false
      });
      
      // If it's been a while since last rest, add another rest period
      const lastRest = schedule
        .filter(item => item.type === ACTIVITY_TYPES.REST)
        .map(item => item.rawTime)
        .reduce((latest, current) => (current > latest ? current : latest), new Date(0));
      
      if ((postPottyTime - lastRest) > (2.5 * 60 * 60 * 1000)) { // 2.5 hours
        const nextRestTime = addMinutes(postPottyTime, 30);
        schedule.push({
          time: format(nextRestTime, 'h:mm a'),
          rawTime: new Date(nextRestTime),
          title: 'Crate Rest',
          type: ACTIVITY_TYPES.REST,
          duration: '60 min',
          completed: false,
          isNext: false
        });
        
        currentScheduleTime = addMinutes(nextRestTime, 90); // Rest + buffer
      } else {
        currentScheduleTime = addMinutes(postPottyTime, 45); // Activity + buffer
      }
    } else {
      break;
    }
  }
  
  // Add final potty and bedtime
  const finalPottyTime = new Date(bedTime);
  finalPottyTime.setHours(bedTime.getHours() - 1);
  
  schedule.push({
    time: format(finalPottyTime, 'h:mm a'),
    rawTime: new Date(finalPottyTime),
    title: 'Final Potty Break',
    type: ACTIVITY_TYPES.POTTY,
    completed: false,
    isNext: false
  });
  
  schedule.push({
    time: format(bedTime, 'h:mm a'),
    rawTime: new Date(bedTime),
    title: 'Bedtime in Crate',
    type: ACTIVITY_TYPES.REST,
    completed: false,
    isNext: false
  });
  
  // Sort the schedule by time
  const sortedSchedule = schedule.sort((a, b) => a.rawTime - b.rawTime);
  
  // Mark the first incomplete activity as next
  const firstIncompleteIndex = sortedSchedule.findIndex(item => !item.completed);
  if (firstIncompleteIndex !== -1) {
    // Reset all isNext flags
    sortedSchedule.forEach(item => item.isNext = false);
    // Set the first incomplete activity as next
    sortedSchedule[firstIncompleteIndex].isNext = true;
  }
  
  return sortedSchedule;
};

/**
 * Get the next activity from the schedule
 * @param {Array} schedule - The generated schedule
 * @returns {Object} The next activity or null if no activities remain
 */
export const getNextActivity = (schedule) => {
  if (!schedule || schedule.length === 0) {
    return null;
  }
  
  const nextActivity = schedule.find(activity => activity.isNext);
  return nextActivity || null;
};

/**
 * Mark an activity as complete and update the next activity
 * @param {Array} schedule - The current schedule
 * @param {number} index - Index of the activity to mark as complete
 * @returns {Array} Updated schedule
 */
export const completeActivity = (schedule, index) => {
  if (!schedule || index < 0 || index >= schedule.length) {
    return schedule;
  }
  
  const updatedSchedule = [...schedule];
  updatedSchedule[index].completed = true;
  updatedSchedule[index].isNext = false;
  
  // Find the next incomplete activity
  const nextIncompleteIndex = updatedSchedule.findIndex((item, i) => i > index && !item.completed);
  
  if (nextIncompleteIndex !== -1) {
    updatedSchedule[nextIncompleteIndex].isNext = true;
  }
  
  return updatedSchedule;
}; 
'use client';

import { useState, useEffect } from 'react';
import DailyQuestionnaire from './components/DailyQuestionnaire';
import NextActivity from './components/NextActivity';
import Timeline from './components/Timeline';
import { generateSchedule, getNextActivity, completeActivity } from './utils/scheduleGenerator';
import { getFormattedPickleAge } from './utils/ageCalculator';
import { getActivityTips } from './utils/dataAccess';

export default function Home() {
  const [schedule, setSchedule] = useState(null);
  const [nextActivity, setNextActivity] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(true);
  const [pickleAge, setPickleAge] = useState('');
  
  useEffect(() => {
    // Set Pickle's age
    setPickleAge(getFormattedPickleAge());
    
    // Check localStorage for saved schedule
    const savedSchedule = localStorage.getItem('pickleSchedule');
    const savedDate = localStorage.getItem('pickleScheduleDate');
    
    if (savedSchedule && savedDate) {
      // Only use saved schedule if it's from today
      const today = new Date().toDateString();
      if (savedDate === today) {
        try {
          const parsedSchedule = JSON.parse(savedSchedule);
          const currentTime = new Date();
          
          // Convert string dates back to Date objects with current date
          parsedSchedule.forEach(item => {
            if (item.rawTime) {
              // Create a new date object with the current date but time from saved schedule
              const savedTime = new Date(item.rawTime);
              const newRawTime = new Date(currentTime);
              
              // Reset isNext flag - we'll recalculate it later
              item.isNext = false;
              
              // Set hours and minutes from the saved time
              newRawTime.setHours(savedTime.getHours(), savedTime.getMinutes(), 0, 0);
              
              // Handle early morning activities (before 6 AM)
              if (savedTime.getHours() < 6) {
                // Always set early morning activities to tomorrow if they're not completed
                if (!item.completed) {
                  newRawTime.setDate(newRawTime.getDate() + 1);
                }
              }
              // Handle past activities that aren't completed
              else if (newRawTime < currentTime && !item.completed) {
                // If activity was more than 2 hours ago, mark it as completed
                const hoursPast = (currentTime - newRawTime) / (60 * 60 * 1000);
                if (hoursPast > 2) {
                  item.completed = true;
                } else {
                  // If it's reasonably recent (within 2 hours), adjust to current time
                  // This handles the case where an immediate activity should be happening now
                  newRawTime.setTime(currentTime.getTime());
                }
              }
              
              item.rawTime = newRawTime;
              
              // Also update the formatted time string
              item.time = item.rawTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
            }
          });
          
          // Clean up the schedule - remove duplicates or closely spaced activities
          const cleanedSchedule = [];
          const seenTimes = new Map();
          
          // Sort before cleaning to ensure correct order
          parsedSchedule.sort((a, b) => a.rawTime - b.rawTime);
          
          // Remove duplicate/redundant activities
          parsedSchedule.forEach(item => {
            if (item.rawTime) {
              const timeKey = item.rawTime.getHours() * 100 + item.rawTime.getMinutes();
              
              // Check if we have an item very close to this time already
              const existingItem = seenTimes.get(timeKey);
              
              if (!existingItem) {
                // No duplicate, add it
                cleanedSchedule.push(item);
                seenTimes.set(timeKey, item);
              } 
              // If there's a duplicate but this one isn't completed and the existing one is
              else if (!item.completed && existingItem.completed) {
                // Replace the completed item with the non-completed one
                const index = cleanedSchedule.indexOf(existingItem);
                cleanedSchedule[index] = item;
                seenTimes.set(timeKey, item);
              }
            }
          });
          
          // Re-sort the cleaned schedule
          cleanedSchedule.sort((a, b) => a.rawTime - b.rawTime);
          
          // Find the next incomplete activity - should be the first non-completed item
          const nextIncompleteIndex = cleanedSchedule.findIndex(item => !item.completed);
          if (nextIncompleteIndex !== -1) {
            // Set the first incomplete activity as next
            cleanedSchedule[nextIncompleteIndex].isNext = true;
          }
          
          setSchedule(cleanedSchedule);
          setNextActivity(getNextActivity(cleanedSchedule));
          setShowQuestionnaire(false);
        } catch (error) {
          console.error("Error parsing saved schedule:", error);
          // If there's an error, we'll just show the questionnaire
          handleReset();
        }
      } else {
        // Not today's schedule, reset
        handleReset();
      }
    }
  }, []);
  
  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    if (schedule) {
      try {
        localStorage.setItem('pickleSchedule', JSON.stringify(schedule));
        localStorage.setItem('pickleScheduleDate', new Date().toDateString());
      } catch (error) {
        console.error("Error saving schedule to localStorage:", error);
      }
    }
  }, [schedule]);
  
  const handleGenerateSchedule = (responses) => {
    const newSchedule = generateSchedule(responses);
    
    // Ensure all times are correct before setting the schedule
    newSchedule.forEach(item => {
      if (item.rawTime) {
        // Update the formatted time string to match the rawTime
        item.time = item.rawTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    });
    
    setSchedule(newSchedule);
    setNextActivity(getNextActivity(newSchedule));
    setShowQuestionnaire(false);
  };
  
  const handleCompleteActivity = (index) => {
    const updatedSchedule = completeActivity(schedule, index);
    setSchedule(updatedSchedule);
    setNextActivity(getNextActivity(updatedSchedule));
  };
  
  const handleReset = () => {
    setShowQuestionnaire(true);
    setSchedule(null);
    setNextActivity(null);
    localStorage.removeItem('pickleSchedule');
    localStorage.removeItem('pickleScheduleDate');
  };
  
  return (
    <main>
      <div className="mb-4 text-center text-gray-600 text-sm">
        🐶 Pickle is {pickleAge} old
      </div>
      
      {showQuestionnaire ? (
        <DailyQuestionnaire onSubmit={handleGenerateSchedule} />
      ) : (
        <>
          {nextActivity && (
            <NextActivity 
              activity={nextActivity} 
              onComplete={() => {
                const index = schedule.findIndex(item => item.isNext);
                if (index !== -1) {
                  handleCompleteActivity(index);
                }
              }} 
              tips={nextActivity ? getActivityTips(nextActivity.type) : []}
            />
          )}
          
          <Timeline 
            schedule={schedule} 
            onCompleteActivity={handleCompleteActivity}
          />
          
          <div className="mt-8 text-center">
            <button 
              onClick={handleReset}
              className="text-primary underline text-sm"
            >
              Reset Schedule
            </button>
          </div>
        </>
      )}
    </main>
  );
} 
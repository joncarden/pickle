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
          // Convert string dates back to Date objects
          parsedSchedule.forEach(item => {
            if (item.rawTime) {
              item.rawTime = new Date(item.rawTime);
            }
          });
          setSchedule(parsedSchedule);
          setNextActivity(getNextActivity(parsedSchedule));
          setShowQuestionnaire(false);
        } catch (error) {
          console.error("Error parsing saved schedule:", error);
          // If there's an error, we'll just show the questionnaire
        }
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
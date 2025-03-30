'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function NextActivity({ activity, onComplete, tips }) {
  const [countdown, setCountdown] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Initialize countdown and current time
    updateCountdown();
    
    // Update countdown and current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateCountdown();
    }, 60000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [activity]);
  
  const updateCountdown = () => {
    if (!activity || !activity.rawTime) return;
    
    const activityTime = new Date(activity.rawTime);
    const now = new Date();
    
    // If it's an immediate activity or the time has passed
    if (activity.isImmediate || now > activityTime) {
      setCountdown('now');
    } else {
      try {
        const timeToActivity = formatDistanceToNow(activityTime, { addSuffix: true });
        setCountdown(timeToActivity);
      } catch (error) {
        console.error("Error formatting time", error);
        setCountdown('');
      }
    }
  };
  
  // If no activity, don't render
  if (!activity) return null;
  
  // Get a tip - first use the activity's notes if available, otherwise use the tips from JSON
  const tip = activity.notes 
    ? activity.notes 
    : (tips && tips.length > 0 
      ? tips[Math.floor(Math.random() * tips.length)] 
      : "Remember to be consistent with Pickle's training!");
  
  // Determine background color based on activity type
  const getBgColor = (type) => {
    const colors = {
      'potty': 'bg-activity-potty',
      'meal': 'bg-activity-meal',
      'rest': 'bg-activity-rest',
      'play': 'bg-activity-play',
      'training': 'bg-activity-training',
      'crate': 'bg-activity-rest',
      'other': 'bg-primary'
    };
    
    return colors[type] || 'bg-primary';
  };
  
  // Format the display time - if it's happening now, show the current time
  const getDisplayTime = () => {
    if (countdown === 'now' || activity.isImmediate) {
      return currentTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' (now)';
    } else {
      return `${activity.time} (${countdown})`;
    }
  };
  
  return (
    <div className={`${getBgColor(activity.type)} text-white rounded-xl p-6 mb-6 shadow-md`}>
      <h2 className="text-sm uppercase tracking-wider opacity-90 mb-1">Next Activity</h2>
      <div className="text-xl font-semibold mb-1">{activity.title}</div>
      <div className="text-base opacity-90 mb-4">{getDisplayTime()}</div>
      
      {activity.duration && (
        <div className="text-sm opacity-75 mb-4">Duration: {activity.duration}</div>
      )}
      
      <div className="bg-white/15 rounded-lg p-4 my-4 border-l-4 border-white/30">
        <h3 className="text-sm uppercase tracking-wider opacity-90 mb-1">Tip</h3>
        <p>{tip}</p>
      </div>
      
      <button 
        onClick={onComplete}
        className="btn btn-secondary mt-2"
      >
        Complete This Activity
      </button>
    </div>
  );
} 
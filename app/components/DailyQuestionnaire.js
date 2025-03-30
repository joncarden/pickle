'use client';

import { useState } from 'react';

export default function DailyQuestionnaire({ onSubmit }) {
  const [potty, setPotty] = useState('no');
  const [lastMeal, setLastMeal] = useState('medium');
  const [lastNap, setLastNap] = useState('medium');
  const [energy, setEnergy] = useState('medium');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      potty,
      lastMeal,
      lastNap,
      energy
    });
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-medium mb-4">Quick Setup for Today</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Has Pickle gone potty in the last hour?</label>
          <div className="toggle-group">
            <input 
              type="radio" 
              id="potty-yes" 
              name="potty" 
              value="yes"
              className="toggle-input"
              checked={potty === 'yes'}
              onChange={() => setPotty('yes')}
            />
            <label 
              htmlFor="potty-yes" 
              className={`toggle-option ${potty === 'yes' ? 'active' : ''}`}
              onClick={() => setPotty('yes')}
            >
              Yes
            </label>
            
            <input 
              type="radio" 
              id="potty-no" 
              name="potty" 
              value="no"
              className="toggle-input"
              checked={potty === 'no'}
              onChange={() => setPotty('no')}
            />
            <label 
              htmlFor="potty-no" 
              className={`toggle-option ${potty === 'no' ? 'active' : ''}`}
              onClick={() => setPotty('no')}
            >
              No
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">When was Pickle's last meal?</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white"
            value={lastMeal}
            onChange={(e) => setLastMeal(e.target.value)}
          >
            <option value="recent">Less than 1 hour ago</option>
            <option value="medium">1-3 hours ago</option>
            <option value="long">More than 3 hours ago</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">How long since Pickle's last nap/crate time?</label>
          <select 
            className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white"
            value={lastNap}
            onChange={(e) => setLastNap(e.target.value)}
          >
            <option value="recent">Just woke up (less than 30 min)</option>
            <option value="medium">30-90 minutes ago</option>
            <option value="long">More than 90 minutes ago</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">What's Pickle's current energy level?</label>
          <div className="toggle-group">
            <input 
              type="radio" 
              id="energy-low" 
              name="energy" 
              value="low"
              className="toggle-input"
              checked={energy === 'low'}
              onChange={() => setEnergy('low')}
            />
            <label 
              htmlFor="energy-low" 
              className={`toggle-option ${energy === 'low' ? 'active' : ''}`}
              onClick={() => setEnergy('low')}
            >
              Low
            </label>
            
            <input 
              type="radio" 
              id="energy-medium" 
              name="energy" 
              value="medium"
              className="toggle-input"
              checked={energy === 'medium'}
              onChange={() => setEnergy('medium')}
            />
            <label 
              htmlFor="energy-medium" 
              className={`toggle-option ${energy === 'medium' ? 'active' : ''}`}
              onClick={() => setEnergy('medium')}
            >
              Medium
            </label>
            
            <input 
              type="radio" 
              id="energy-high" 
              name="energy" 
              value="high"
              className="toggle-input"
              checked={energy === 'high'}
              onChange={() => setEnergy('high')}
            />
            <label 
              htmlFor="energy-high" 
              className={`toggle-option ${energy === 'high' ? 'active' : ''}`}
              onClick={() => setEnergy('high')}
            >
              High
            </label>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary mt-4">
          Generate Schedule
        </button>
      </form>
    </div>
  );
} 
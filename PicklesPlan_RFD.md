# Request for Development (RFD)
# Pickle's Plan: Puppy Schedule Assistant Mobile Web App

## Project Overview

"Pickle's Plan" is a mobile web application designed to assist dog owners in managing their puppy's daily schedule. Specifically tailored for a 10-week-old Golden Retriever named Pickle, the app follows Will Atherton's positive reinforcement training methodology, providing time-sensitive guidance, training tips, and schedule management capabilities.

This document outlines the requirements, functionality, user experience, and technical specifications for development.

## Project Objectives

1. Create an intuitive, minimalist mobile web app that helps the owner maintain a consistent daily schedule for Pickle
2. Provide contextual training tips based on the puppy's current needs and activities
3. Simplify puppy care by clearly showing the next priority action alongside a full daily timeline
4. Reinforce positive training techniques through integrated reminders and guidance
5. Allow easy tracking of completed activities throughout the day

## User Experience & Interface Design

### Core User Flow

1. **Daily Questionnaire** - Upon first launch each day, the app presents a brief questionnaire to establish context for schedule generation
2. **Schedule Generation** - The app generates a personalized schedule based on questionnaire responses, current time, and age-appropriate JSON template
3. **Activity Management** - The user interacts with the schedule throughout the day, marking activities complete and receiving guidance

### UI Components

#### 1. Daily Questionnaire
* Clean, minimal form with 4 essential questions:
  - Has Pickle gone potty in the last hour? (Yes/No)
  - When was Pickle's last meal? (Less than 1hr / 1-3hrs / More than 3hrs)
  - How long since Pickle's last nap/crate time? (Just woke up / 30-90min / More than 90min)
  - What's Pickle's current energy level? (Low/Medium/High)
* Large "Generate Schedule" button to create the day's plan

#### 2. Next Activity Card
* Prominent card showing the next priority activity
* Content includes:
  - Activity title (e.g., "Potty Break + Short Play")
  - Scheduled time and countdown ("2:15 PM (in 12 minutes)")
  - Relevant training tip pulled from JSON guidance based on activity type and age
  - "Complete Activity" button

#### 3. Timeline View
* Google Calendar-inspired vertical timeline showing the full day's schedule
* Each activity represented by:
  - Time (left side)
  - Activity description (right side)
  - Color-coded vertical bar indicating activity type:
    * Teal: Potty breaks
    * Blue: Meal times
    * Purple: Rest/crate time
    * Green: Completed activities
    * Primary blue: Next upcoming activity
* Timeline extends from current time until 9:30pm bedtime

## Data Model & Content

The app will use a structured JSON data model to store age-specific guidance for Pickle from 10 weeks to 6 months. The data is organized into the following hierarchy:

1. **Age Ranges (10-12 weeks, 13-16 weeks, 17-20 weeks, 21-26 weeks)**
2. **Core Training Categories**
   - Feeding: Schedules, amounts, methods
   - Crating: Techniques, durations, troubleshooting
   - Potty Training: Schedules, communication, accident prevention

3. **Schedule Templates**
   - Age-appropriate daily patterns
   - Activity timing recommendations
   - Sleep/wake hour recommendations

The complete JSON data structure has been provided as a separate file (`pickle-guidance-focused.json`) and should be integrated into the app. The app will dynamically access the appropriate guidance based on Pickle's age, which is calculated from her hardcoded birth date (January 7, 2025).

## Functional Requirements

### 1. Age-Based Adaptation
* Hardcode Pickle's birth date: January 7, 2025
* Automatically calculate Pickle's current age in weeks
* Reference the appropriate age range in the JSON guidance data
* Present age-appropriate recommendations through the following phases:
  - 10-12 weeks: Heavy focus on frequent potty breaks, crate introduction, 3 meals daily
  - 13-16 weeks: Extended crate durations, 2-3 hour potty intervals, transitioning to 2 meals
  - 17-20 weeks: 3-4 hour crate comfort, established potty communication, 2 meals daily
  - 21-26 weeks: Adult-like schedule with freedom testing, 4-6 hour potty reliability

### 2. Schedule Generation
* Access appropriate schedule template from JSON based on Pickle's current age
* Modify template based on questionnaire responses (potty timing, recent meals, etc.)
* Generate customized schedule from current time until 9:30pm bedtime
* Prioritize critical activities based on answers to daily questionnaire
* Always account for age-appropriate:
  - Potty break frequency (decreasing as Pickle ages)
  - Meal timing (3 meals to 2 meals transition around 14-15 weeks)
  - Crate/rest periods (decreasing total sleep hours as Pickle matures)

### 3. Activity Management
* Ability to mark activities as complete
* Automatic advancement to next activity
* Contextual tips pulled from JSON data based on:
  - Activity type (feeding, crating, potty)
  - Pickle's current age
  - Time of day (morning, afternoon, evening)
* Support for basic scheduling adjustments if needed

### 4. Training Tips Integration
* Pull contextual tips from JSON data relevant to the current/upcoming activity
* Focus on Will Atherton's positive reinforcement methodology
* Display age-appropriate techniques for:
  - Crate training (proper luring vs. forcing)
  - Potty training (frequency, praise, and rewards)
  - Feeding (amounts, methods, and schedules)

### 5. Time Awareness
* App uses device's system time
* Matches current time against appropriate schedule template
* Provides countdown to next activity
* Visual timeline representation showing full day's plan

## Technical Specifications

### Development Approach
* Progressive Web App (PWA) for cross-platform compatibility
* Mobile-first responsive design
* Modern CSS framework (e.g., Tailwind CSS)
* Client-side JavaScript for interactivity

### Data Management
* JSON data structure for age-specific guidance (`pickle-guidance-focused.json`)
* Local storage for persistence across sessions
* No server-side component required
* No user accounts necessary
* Age calculation logic based on hardcoded birth date (January 7, 2025)

### Technical Implementation

1. **JSON Data Integration**
   - Import the provided JSON guidance data
   - Create utility functions to access appropriate age-range data
   - Implement age calculation from birthdate
   - Build template selector based on age and time of day

2. **App Architecture**
   - Single-page application with state management
   - Component-based UI structure
   - Responsive layout using Flexbox/CSS Grid
   - Local storage for persisting daily activities and completion status

3. **Core Components**
   - Age calculator
   - Daily questionnaire form
   - Schedule generator
   - Next activity card
   - Timeline visualization
   - Contextual tip display

### Browser Support
* All modern mobile browsers (Safari, Chrome, Firefox)
* PWA capability for home screen installation

## Visual Design Guidelines

* **Color Palette:**
  - Primary: #4a90e2 (Blue)
  - Secondary/Accent: #f5a623 (Gold/Yellow)
  - Success: #7ed321 (Green)
  - Background: Light neutral (#f8f9fa)
  - Text: Dark (#333333)
  - Timeline activity type colors as specified in UI Components

* **Typography:**
  - System fonts for optimal performance
  - Sans-serif font family
  - Clear hierarchy with size and weight variations
  - Minimal use of text embellishments

* **Visual Style:**
  - Clean, minimalist interface
  - White space focused layout
  - Subtle shadows for depth cues
  - Minimal animations (transitions only)
  - No decorative illustrations except where functional

## Age-Specific Guidance Library

The app will include a comprehensive library of hardcoded guidance for Pickle from 10 weeks to 6 months, organized by developmental stage. This ensures the app remains valuable throughout the critical puppy development period.

## Conclusion

"Pickle's Plan" will provide a valuable tool for establishing and maintaining a consistent puppy schedule using positive reinforcement techniques. The minimalist design prioritizes ease of use while offering contextual guidance throughout the day.

This app addresses the specific needs of raising a Golden Retriever puppy while educating the owner on proper training methods that avoid common pitfalls like forced crate entry and inconsistent schedules.

## Development Checklist

### Project Setup
- [ ] Initialize project repository
- [ ] Set up development environment
- [ ] Install necessary dependencies (React, Tailwind CSS, etc.)
- [ ] Configure build system
- [ ] Create basic folder structure
- [ ] Set up PWA configuration

### Data Structure
- [ ] Create JSON data structure for age-specific guidance
- [ ] Implement age calculation utility
- [ ] Create utility functions to access appropriate guidance based on age
- [ ] Implement schedule template selection logic

### UI Components
- [ ] Design and implement responsive layout
- [ ] Create daily questionnaire component
- [ ] Implement next activity card
- [ ] Build timeline visualization component
- [ ] Design activity management interface
- [ ] Create contextual tip display
- [ ] Implement color-coding system for activities

### Core Functionality
- [ ] Implement daily questionnaire logic
- [ ] Create schedule generation algorithm
- [ ] Build activity completion tracking
- [ ] Implement time awareness and countdown functionality
- [ ] Create local storage persistence
- [ ] Implement age-based adaptation logic

### Integration & Testing
- [ ] Connect all components with state management
- [ ] Implement end-to-end user flow
- [ ] Test on various mobile devices and browsers
- [ ] Perform usability testing
- [ ] Fix bugs and refine UI
- [ ] Optimize performance

### Deployment
- [ ] Prepare for production
- [ ] Configure hosting environment
- [ ] Deploy PWA
- [ ] Set up analytics (optional)
- [ ] Gather user feedback 
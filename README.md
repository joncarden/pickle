# Pickle's Plan: Puppy Schedule Assistant

Pickle's Plan is a mobile web application designed to help manage a puppy's daily schedule, specifically tailored for a Golden Retriever named Pickle. Following Will Atherton's positive reinforcement training methodology, the app provides time-sensitive guidance, training tips, and schedule management.

## Features

- **Age-Based Adaptation**: Automatically adjusts recommendations based on Pickle's age
- **Daily Questionnaire**: Quick setup to establish context for schedule generation
- **Personalized Schedule**: Creates a customized daily plan from current time until bedtime
- **Next Activity Card**: Clear display of the next priority action with countdown
- **Timeline View**: Full day's schedule with activity tracking
- **Training Tips**: Contextual advice based on activity type and age
- **Persistence**: Saves schedule and completed activities across sessions

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/pickles-plan.git
cd pickles-plan
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technology Stack

- **Next.js**: React framework for the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **date-fns**: Date utility library for time-related functionality
- **Local Storage**: For persisting schedule data between sessions

## Project Structure

```
pickles-plan/
├── app/
│   ├── components/           # UI components
│   ├── data/                 # JSON data for age-specific guidance
│   ├── styles/               # Global CSS styles
│   ├── utils/                # Utility functions
│   ├── layout.js             # App layout
│   └── page.js               # Main page component
├── public/                   # Static assets
├── README.md                 # This file
└── package.json              # Project configuration
```

## Usage

1. **Daily Setup**: Answer four questions about Pickle's current state
2. **View Schedule**: See the generated schedule for the day
3. **Track Activities**: Mark activities as complete as you go through the day
4. **Get Guidance**: View contextual tips for each activity

## Development Notes

- The birth date for Pickle is hardcoded as January 7, 2025
- The app is designed for puppies from 10 weeks to 26 weeks
- Schedule generation accounts for potty frequency, meal timing, and rest periods appropriate to Pickle's age

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
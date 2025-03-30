'use client';

export default function Timeline({ schedule, onCompleteActivity }) {
  if (!schedule || schedule.length === 0) {
    return null;
  }
  
  const getTypeClass = (type, isCompleted, isNext) => {
    if (isCompleted) {
      return 'bg-success';
    }
    
    if (isNext) {
      return 'bg-primary';
    }
    
    const typeClasses = {
      'potty': 'bg-activity-potty',
      'meal': 'bg-activity-meal',
      'rest': 'bg-activity-rest',
      'play': 'bg-activity-play',
      'training': 'bg-activity-training',
      'crate': 'bg-activity-rest',
      'other': 'bg-gray'
    };
    
    return typeClasses[type] || 'bg-gray';
  };
  
  return (
    <div className="card">
      <h2 className="text-gray font-medium mb-4 uppercase tracking-wider text-sm">Today's Schedule</h2>
      
      <div className="timeline">
        {schedule.map((activity, index) => (
          <div
            key={`${activity.time}-${index}`}
            className={`timeline-item relative pl-8 pb-4 mb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0 ${
              activity.completed ? 'opacity-60' : ''
            }`}
            onClick={() => {
              if (!activity.completed && !activity.isNext) {
                // Only allow completing activities in order
                // Find the next incomplete activity index
                const nextIncompleteIndex = schedule.findIndex(item => !item.completed);
                if (nextIncompleteIndex !== -1 && index > nextIncompleteIndex) {
                  alert('Please complete activities in order');
                  return;
                }
                
                onCompleteActivity(index);
              }
            }}
          >
            <div 
              className={`absolute left-0 top-0 bottom-0 w-2 rounded ${getTypeClass(
                activity.type,
                activity.completed,
                activity.isNext
              )}`}
            ></div>
            
            <div className="flex">
              <div className="w-20 font-medium text-dark">
                {activity.time}
              </div>
              
              <div className="flex-1">
                <div className="font-medium text-dark mb-1 flex items-center">
                  {activity.title}
                  {activity.isNext && (
                    <span className="ml-2 text-xs font-normal text-primary bg-blue-50 py-1 px-2 rounded-full">
                      Next
                    </span>
                  )}
                  {activity.completed && (
                    <span className="ml-2 text-xs font-normal text-success bg-green-50 py-1 px-2 rounded-full">
                      ✓ Done
                    </span>
                  )}
                </div>
                
                {activity.duration && (
                  <div className="text-sm text-gray-600">
                    Duration: {activity.duration}
                  </div>
                )}
                
                {activity.notes && (
                  <div className="text-sm text-gray-600 mt-1 italic">
                    {activity.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
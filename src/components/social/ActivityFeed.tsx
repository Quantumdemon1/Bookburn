import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Flame, Heart, ShoppingBag, UserPlus, BookOpen } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import type { Activity } from '../../types/social';

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'burn':
      return <Flame className="w-5 h-5 text-[#FF1B4C]" />;
    case 'like':
      return <Heart className="w-5 h-5 text-[#FF1B4C]" />;
    case 'purchase':
      return <ShoppingBag className="w-5 h-5 text-[#FF1B4C]" />;
    case 'follow':
      return <UserPlus className="w-5 h-5 text-[#FF1B4C]" />;
    case 'review':
      return <BookOpen className="w-5 h-5 text-[#FF1B4C]" />;
    default:
      return null;
  }
};

const ActivityMessage = ({ activity }: { activity: Activity }) => {
  switch (activity.type) {
    case 'burn':
      return <span>burned a book</span>;
    case 'like':
      return <span>liked {activity.metadata?.bookTitle}</span>;
    case 'purchase':
      return <span>purchased {activity.metadata?.bookTitle}</span>;
    case 'follow':
      return <span>started following a new reader</span>;
    case 'review':
      return (
        <div>
          <span>reviewed {activity.metadata?.bookTitle}</span>
          {activity.metadata?.rating && (
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < (activity.metadata?.rating || 0)
                      ? 'text-[#FF1B4C]'
                      : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          {activity.metadata?.review && (
            <p className="mt-2 text-sm text-gray-400">
              "{activity.metadata.review}"
            </p>
          )}
        </div>
      );
    default:
      return null;
  }
};

const ActivityFeed = () => {
  const { activities, getFeedActivities } = useSocialStore();

  React.useEffect(() => {
    getFeedActivities();
  }, []);

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-gray-900 rounded-lg p-4 flex items-start gap-4"
        >
          <div className="mt-1">
            <ActivityIcon type={activity.type} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={`https://api.dicebear.com/7.x/avatars/svg?seed=${activity.userId}`}
                alt="User avatar"
                className="w-6 h-6 rounded-full"
              />
              <ActivityMessage activity={activity} />
            </div>
            
            <span className="text-sm text-gray-400">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
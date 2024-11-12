import React from 'react';
import { useSocialStore } from '../../store/socialStore';
import { UserPlus, Users2, BookOpen } from 'lucide-react';

const UserRecommendations = () => {
  const { recommendations, getRecommendedUsers, follow } = useSocialStore();

  React.useEffect(() => {
    getRecommendedUsers();
  }, []);

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <div
          key={recommendation.user.id}
          className="bg-gray-900 rounded-lg p-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={recommendation.user.avatar || 
                `https://api.dicebear.com/7.x/avatars/svg?seed=${recommendation.user.id}`
              }
              alt={recommendation.user.username}
              className="w-12 h-12 rounded-full"
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{recommendation.user.username}</h3>
                <button
                  onClick={() => follow(recommendation.user.id)}
                  className="bg-[#FF1B4C] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#E01543] transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Follow
                </button>
              </div>
              
              {recommendation.user.bio && (
                <p className="text-sm text-gray-400 mt-1">
                  {recommendation.user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users2 className="w-4 h-4" />
              {recommendation.mutualFriends} mutual friends
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {recommendation.commonInterests.length} books in common
            </div>
          </div>

          {recommendation.commonInterests.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Both enjoy: {recommendation.commonInterests.slice(0, 3).join(', ')}
                {recommendation.commonInterests.length > 3 && ' and more...'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserRecommendations;
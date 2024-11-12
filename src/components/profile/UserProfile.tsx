import React from 'react';
import { useAuthStore } from '../../store/authStore';
import ReadingStats from '../social/ReadingStats';
import ActivityFeed from '../social/ActivityFeed';
import UserRecommendations from '../social/UserRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { BookOpen, Users2, BarChart3, Activity } from 'lucide-react';

const UserProfile = () => {
  const user = useAuthStore(state => state.user);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full border-4 border-[#FF1B4C]"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-300 mb-4">{user.bio}</p>
        )}

        <div className="flex gap-4">
          <div>
            <span className="font-bold">{user.followers.length}</span>
            <span className="text-gray-400 ml-1">Followers</span>
          </div>
          <div>
            <span className="font-bold">{user.following.length}</span>
            <span className="text-gray-400 ml-1">Following</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="bg-gray-900 p-1 rounded-lg mb-6">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Users2 className="w-4 h-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="books">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Favorite Authors</h3>
              <ul className="space-y-1">
                {user.favoriteAuthors.map((author) => (
                  <li key={author} className="text-gray-300">{author}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Favorite Books</h3>
              <ul className="space-y-1">
                {user.favoriteBooks.map((book) => (
                  <li key={book} className="text-gray-300">{book}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Favorite Movies</h3>
              <ul className="space-y-1">
                {user.favoriteMovies.map((movie) => (
                  <li key={movie} className="text-gray-300">{movie}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <UserRecommendations />
        </TabsContent>

        <TabsContent value="stats">
          <ReadingStats userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
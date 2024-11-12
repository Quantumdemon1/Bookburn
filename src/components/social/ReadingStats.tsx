import React from 'react';
import { BookOpen, Flame, BarChart3 } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';

interface ReadingStatsProps {
  userId: string;
}

const ReadingStats = ({ userId }: ReadingStatsProps) => {
  const { getUserReadingStats } = useSocialStore();
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      const userStats = await getUserReadingStats(userId);
      setStats(userStats);
    };
    fetchStats();
  }, [userId]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#FF1B4C]" />
          <h3 className="font-semibold">Books Read</h3>
        </div>
        <p className="text-2xl font-bold">{stats.booksRead}</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-[#FF1B4C]" />
          <h3 className="font-semibold">Reading Streak</h3>
        </div>
        <p className="text-2xl font-bold">{stats.readingStreak} days</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-[#FF1B4C]" />
          <h3 className="font-semibold">Total Pages</h3>
        </div>
        <p className="text-2xl font-bold">{stats.totalPages}</p>
      </div>

      <div className="md:col-span-3 bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Favorite Genres</h3>
        <div className="space-y-2">
          {stats.favoriteGenres.map((genre: any) => (
            <div key={genre.genre} className="flex items-center gap-2">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-[#FF1B4C] h-full rounded-full"
                  style={{ width: `${(genre.count / stats.booksRead) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{genre.genre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingStats;
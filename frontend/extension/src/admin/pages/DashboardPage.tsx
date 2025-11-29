import React, { useEffect, useState } from 'react';
import { adminService, OverviewStats as IOverviewStats, UsageStats, AccuracyStats, TopCategory, Activity } from '../services/admin.service';
import { OverviewStats } from '../components/OverviewStats';
import { UsageChart } from '../components/UsageChart';
import { AccuracyChart } from '../components/AccuracyChart';
import { TopCategories } from '../components/TopCategories';
import { RecentActivities } from '../components/RecentActivities';

export const DashboardPage: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState<IOverviewStats | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats | null>(null);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overview, usage, accuracy, categories, activities] = await Promise.all([
          adminService.getOverviewStats(),
          adminService.getUsageStats(),
          adminService.getAccuracyStats(),
          adminService.getTopCategories(),
          adminService.getRecentActivities(),
        ]);

        setOverviewStats(overview);
        setUsageStats(usage);
        setAccuracyStats(accuracy);
        setTopCategories(categories);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="p-8 flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex gap-3">
            {/* Quick Actions */}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Review Reports
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Update AI Model
            </button>
        </div>
      </div>

      {overviewStats && <OverviewStats stats={overviewStats} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {usageStats && <UsageChart data={usageStats} />}
        {accuracyStats && <AccuracyChart data={accuracyStats} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopCategories categories={topCategories} />
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
};

import React from 'react';
import { Users, Activity, ShieldAlert, FileText } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { OverviewStats as IOverviewStats } from '../services/admin.service';

interface OverviewStatsProps {
  stats: IOverviewStats;
  isLoading?: boolean;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
      ))}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Users"
        value={stats.total_users.toLocaleString()}
        icon={Users}
      />
      <StatsCard
        title="Active Today"
        value={stats.active_today.toLocaleString()}
        icon={Activity}
      />
      <StatsCard
        title="Content Blocked"
        value={stats.content_blocked.toLocaleString()}
        icon={ShieldAlert}
      />
      <StatsCard
        title="Pending Reports"
        value={stats.pending_reports.toLocaleString()}
        icon={FileText}
      />
    </div>
  );
};

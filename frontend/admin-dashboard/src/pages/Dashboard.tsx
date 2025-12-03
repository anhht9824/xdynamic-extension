import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Users, 
  DollarSign, 
  Shield, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { adminService, OverviewStats, ApiError } from '../services/admin.service';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, error } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminService.getOverviewStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
      if (err instanceof ApiError) {
        error(err.message);
      } else {
        error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users ?? '...',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: stats 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.total_revenue)
        : '...',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Blocked Content',
      value: stats?.blocked_images_count ?? '...',
      change: '+5.2%',
      changeType: 'negative' as const,
      icon: Shield,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: 'Active Today',
      value: stats?.active_today ?? '...',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Activity,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's an overview of your system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className={`text-sm mt-1 flex items-center ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`${stat.iconBg} p-4 rounded-lg`}>
                      <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">API Server</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Database</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">ML Inference</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-700">Payment Gateway</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">Degraded</span>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-700">Pending Reports</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.pending_reports ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">New Users Today</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {stats?.active_today ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-700">Content Blocked Today</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {stats?.content_blocked ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

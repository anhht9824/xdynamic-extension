import React from 'react';
import { Search } from 'lucide-react';

interface ReportFiltersProps {
  filters: {
    status: string;
    dateRange: string;
    category: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-4">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="reviewed">Reviewed</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Nudity">Nudity</option>
          <option value="Violence">Violence</option>
          <option value="Hate Speech">Hate Speech</option>
          <option value="Spam">Spam</option>
          <option value="Harassment">Harassment</option>
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search reports..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { adminService, Report } from '../services/admin.service';
import { ReportFilters } from '../components/ReportFilters';
import { ReportTable } from '../components/ReportTable';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    category: 'all',
    search: '',
  });

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getReports({
        page,
        limit,
        status: filters.status,
        date_range: filters.dateRange,
        category: filters.category,
        search: filters.search,
      });
      setReports(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(reports.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'review') => {
    try {
      await adminService.handleReportAction([id], action);
      // Refresh list
      fetchReports();
      setSelectedIds(prev => prev.filter(i => i !== id));
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;
    try {
      await adminService.handleReportAction(selectedIds, action);
      fetchReports();
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk action failed", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reported Content</h2>
          <p className="text-gray-500 text-sm mt-1">Review and manage user-reported content for policy violations.</p>
        </div>
      </div>

      <ReportFilters filters={filters} onFilterChange={handleFilterChange} />

      <ReportTable
        reports={reports}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onAction={handleAction}
      />

      {/* Pagination & Bulk Actions */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                Bulk Approve ({selectedIds.length})
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Bulk Reject ({selectedIds.length})
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

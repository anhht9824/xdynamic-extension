import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  Search, 
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';

interface Report {
  id: string;
  contentPreview: string;
  reportReason: string;
  reporter: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewed';
  category: string;
}

// Mock data for reports
const mockReports: Report[] = [
  { id: 'rpt_001', contentPreview: 'https://example.com/image1.jpg', reportReason: 'Inappropriate Content', reporter: 'user_42', submissionDate: '2025-12-01', status: 'pending', category: 'Nudity' },
  { id: 'rpt_002', contentPreview: 'Offensive comment about...', reportReason: 'Hate Speech', reporter: 'user_15', submissionDate: '2025-12-01', status: 'pending', category: 'Hate Speech' },
  { id: 'rpt_003', contentPreview: 'https://example.com/image2.jpg', reportReason: 'Violence', reporter: 'user_88', submissionDate: '2025-11-30', status: 'approved', category: 'Violence' },
  { id: 'rpt_004', contentPreview: 'Spam message content...', reportReason: 'Spam', reporter: 'user_23', submissionDate: '2025-11-30', status: 'rejected', category: 'Spam' },
  { id: 'rpt_005', contentPreview: 'https://example.com/image3.jpg', reportReason: 'Harassment', reporter: 'user_56', submissionDate: '2025-11-29', status: 'reviewed', category: 'Harassment' },
];

const getStatusBadge = (status: Report['status']) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-800 border border-amber-300',
    approved: 'bg-green-100 text-green-800 border border-green-300',
    rejected: 'bg-red-100 text-red-800 border border-red-300',
    reviewed: 'bg-blue-100 text-blue-800 border border-blue-300',
  };
  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
    reviewed: Eye,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const Reports: React.FC = () => {
  const [reports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { toasts, success } = useToast();

  const handleAction = (reportId: string, action: 'approve' | 'reject') => {
    success(`Report ${reportId} ${action}d successfully`);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reported Content</h1>
          <p className="text-base text-gray-500 mt-2">
            Review and manage user reports • <span className="font-semibold text-gray-700">{filteredReports.length}</span> reports
          </p>
        </div>

        {/* Sticky Filter Toolbar */}
        <div className="sticky top-16 z-20 bg-white border-b border-gray-200 -mx-6 px-6 py-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reason or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="reviewed">Reviewed</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="flex items-center justify-center px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors font-medium text-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {report.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {report.reportReason}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {report.reporter}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(report.submissionDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleAction(report.id, 'approve')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(report.id, 'reject')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <p className="text-sm">No reports found matching your criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-lg shadow-sm px-6 py-4 border border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredReports.length}</span> of{' '}
            <span className="font-medium">{filteredReports.length}</span> results
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 bg-primary-700 text-white rounded-lg font-medium text-sm">
              1
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={true}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

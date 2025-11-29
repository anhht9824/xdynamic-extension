import React from 'react';
import { Report } from '../services/admin.service';
import { Check, X, Eye, MoreHorizontal } from 'lucide-react';

interface ReportTableProps {
  reports: Report[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onAction: (id: string, action: 'approve' | 'reject' | 'review') => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ 
  reports, 
  selectedIds, 
  onSelect, 
  onSelectAll,
  onAction 
}) => {
  const allSelected = reports.length > 0 && selectedIds.length === reports.length;

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
      approved: 'bg-green-50 text-green-700 border-green-100',
      rejected: 'bg-red-50 text-red-700 border-red-100',
      reviewed: 'bg-blue-50 text-blue-700 border-blue-100',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="py-3 px-4">Content</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Reporter</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id} className="group hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(report.id)}
                    onChange={() => onSelect(report.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {report.content_preview.startsWith('http') ? (
                        <img src={report.content_preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-gray-400">Text</span>
                      )}
                    </div>
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">
                        {report.content_preview.startsWith('http') ? 'Image Content' : report.content_preview}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{report.report_reason}</td>
                <td className="py-4 px-4 text-blue-600">{report.reporter}</td>
                <td className="py-4 px-4 text-gray-500">
                  {new Date(report.submission_date).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(report.status)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onAction(report.id, 'approve')}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => onAction(report.id, 'reject')}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => onAction(report.id, 'review')}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Review Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reports.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No reports found matching your filters.
        </div>
      )}
    </div>
  );
};

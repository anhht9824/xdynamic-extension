import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  ChevronDown, 
  Search, 
  Edit, 
  Ban, 
  MoreVertical,
  Download,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  X,
  Check
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/SkeletonLoader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  role: 'Admin' | 'User' | 'Moderator';
  status: 'Active' | 'Inactive' | 'Banned';
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'JD', joinedDate: '2024-01-15', lastActive: '2 hours ago', role: 'User', status: 'Active' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', avatar: 'SS', joinedDate: '2024-02-20', lastActive: '1 day ago', role: 'Moderator', status: 'Active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', joinedDate: '2024-03-10', lastActive: '3 days ago', role: 'User', status: 'Inactive' },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED', joinedDate: '2024-01-05', lastActive: '5 mins ago', role: 'Admin', status: 'Active' },
  { id: '5', name: 'David Wilson', email: 'david@example.com', avatar: 'DW', joinedDate: '2023-12-01', lastActive: '1 week ago', role: 'User', status: 'Banned' },
];

export const UserManagement: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toasts, success } = useToast();

  // Filtered users based on search and filters
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           user.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [debouncedSearch, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAll = () => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'ban') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSelectedUsers(new Set());
      success(`Successfully ${action === 'activate' ? 'activated' : 'banned'} ${selectedUsers.size} user(s)`);
    }, 1000);
  };

  const handleExport = () => {
    success('Exporting users to CSV...');
    // Simulate export
    setTimeout(() => {
      success('Export completed successfully!');
    }, 1500);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setRoleFilter('All');
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'badge-danger';
      case 'Moderator': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Inactive': return 'badge-gray';
      case 'Banned': return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage user accounts and permissions • {filteredUsers.length} total users
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleExport}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-primary flex items-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input appearance-none pr-8"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Banned</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input appearance-none pr-8"
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Moderator</option>
                <option>User</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              disabled={searchQuery === '' && statusFilter === 'All' && roleFilter === 'All'}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.size > 0 && (
          <div className="card p-4 bg-primary-50 border-primary-200 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-primary-600" />
                <p className="text-sm font-medium text-primary-700">
                  {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleBulkAction('activate')}
                  disabled={isLoading}
                  className="btn btn-secondary text-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  <span>Bulk Activate</span>
                </button>
                <button 
                  onClick={() => handleBulkAction('ban')}
                  disabled={isLoading}
                  className="btn btn-danger text-sm disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading && <LoadingSpinner size="sm" />}
                  <span>Bulk Ban</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <TableSkeleton rows={5} columns={8} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description={
                debouncedSearch || statusFilter !== 'All' || roleFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first user'
              }
              action={
                debouncedSearch || statusFilter !== 'All' || roleFilter !== 'All' ? (
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear Filters
                  </button>
                ) : (
                  <button className="btn btn-primary flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Add First User</span>
                  </button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input 
                        type="checkbox" 
                        checked={paginatedUsers.length > 0 && selectedUsers.size === paginatedUsers.length}
                        onChange={toggleAll}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
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
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleUser(user.id)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {user.avatar}
                          </div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.joinedDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-danger hover:bg-red-50 rounded transition-colors"
                            title="Ban user"
                            onClick={() => success(`User ${user.name} has been banned`)}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="card px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded font-medium text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

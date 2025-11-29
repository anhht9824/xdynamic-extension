import React, { useState } from 'react';
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

import { adminService, User } from '../services/admin.service';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { toasts, success, error } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUsers(
        currentPage, 
        itemsPerPage, 
        debouncedSearch, 
        statusFilter === 'All' ? '' : statusFilter, 
        roleFilter === 'All' ? '' : roleFilter
      );
      setUsers(response.users);
      setTotalUsers(response.total);
    } catch (err) {
      error('Failed to fetch users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  // No client-side slicing needed as backend handles it

  const toggleUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  const handleBulkAction = async (action: 'activate' | 'ban') => {
    setIsLoading(true);
    try {
        // Sequentially update for now as backend doesn't support bulk yet
        for (const userId of selectedUsers) {
            await adminService.updateUserStatus(userId, action === 'activate', null);
        }
        success(`Successfully ${action === 'activate' ? 'activated' : 'banned'} ${selectedUsers.size} user(s)`);
        fetchUsers();
        setSelectedUsers(new Set());
    } catch (err) {
        error('Failed to perform bulk action');
    } finally {
        setIsLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, currentStatus: boolean) => {
      try {
          await adminService.updateUserStatus(userId, !currentStatus, null);
          success(`User ${!currentStatus ? 'activated' : 'banned'} successfully`);
          fetchUsers();
      } catch (err) {
          error('Failed to update user status');
      }
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
              Manage user accounts and permissions • {totalUsers} total users
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
          ) : users.length === 0 ? (
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
                        checked={users.length > 0 && selectedUsers.size === users.length}
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
                  {users.map((user) => (
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
                            {user.full_name || user.email.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900">{user.full_name || 'No Name'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getRoleBadgeColor(user.is_admin ? 'Admin' : 'User')}`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusBadgeColor(user.is_active ? 'Active' : 'Banned')}`}>
                          {user.is_active ? 'Active' : 'Banned'}
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
                            className={`p-2 ${user.is_active ? 'text-danger hover:bg-red-50' : 'text-green-600 hover:bg-green-50'} rounded transition-colors`}
                            title={user.is_active ? "Ban user" : "Activate user"}
                            onClick={() => handleStatusChange(user.id, user.is_active)}
                          >
                            {user.is_active ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
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
        {!isLoading && users.length > 0 && (
          <div className="card px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalUsers)}</span> of{' '}
              <span className="font-medium">{totalUsers}</span> results
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

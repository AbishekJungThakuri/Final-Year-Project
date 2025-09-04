import React, { useState, useEffect } from 'react';
import { getAllUsers, getUserById } from '../api/users';
import { LayoutList, Grid3x3, Search, User, Mail, Shield, Users } from 'lucide-react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ size: pageSize, search });
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageSize, search]);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-orange-100 text-orange-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '👑';
      case 'moderator':
        return '🛡️';
      case 'user':
        return '👤';
      default:
        return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
                <p className="text-gray-500 text-sm">{users.length} users total</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size} users</option>
                ))}
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {viewMode === 'table' ? <Grid3x3 size={18} /> : <LayoutList size={18} />}
                {viewMode === 'table' ? 'Card View' : 'Table View'}
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'table' && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">@{user.username?.toLowerCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          <span>{getRoleIcon(user.role)}</span>
                          {user.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        #{user.id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{user.username}</h3>
                    <p className="text-sm text-gray-500 truncate">@{user.username?.toLowerCase()}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-400 flex-shrink-0" />
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      <span>{getRoleIcon(user.role)}</span>
                      {user.role || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="font-mono">ID: #{user.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <User className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Users</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-500">
              {search ? `No users match your search "${search}"` : 'No users are available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
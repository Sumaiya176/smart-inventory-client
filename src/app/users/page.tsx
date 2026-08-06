// frontend/src/app/users/page.tsx
'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks/useRedux';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import {
  Users,
  User,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Sample users data - replace with API call
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'active',
      phone: '+880 1533-992201',
      lastLogin: '2026-08-03 14:30:00',
      createdAt: '2026-01-15',
      avatar: 'A'
    },
    {
      id: '2',
      name: 'Manager User',
      email: 'manager@example.com',
      role: 'MANAGER',
      status: 'active',
      phone: '+880 1533-992202',
      lastLogin: '2026-08-03 12:15:00',
      createdAt: '2026-02-20',
      avatar: 'M'
    },
    {
      id: '3',
      name: 'Viewer User',
      email: 'viewer@example.com',
      role: 'VIEWER',
      status: 'active',
      phone: '+880 1533-992203',
      lastLogin: '2026-08-02 16:45:00',
      createdAt: '2026-03-10',
      avatar: 'V'
    },
    {
      id: '4',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'VIEWER',
      status: 'inactive',
      phone: '+880 1533-992204',
      lastLogin: '2026-07-28 09:20:00',
      createdAt: '2026-04-05',
      avatar: 'J'
    },
  ]);

  const roleBadgeColors = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-blue-100 text-blue-800',
    VIEWER: 'bg-green-100 text-green-800',
  };

  const roleIcons = {
    ADMIN: ShieldAlert,
    MANAGER: ShieldCheck,
    VIEWER: Shield,
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center"><XCircle className="w-3 h-3 mr-1" /> Inactive</span>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    managers: users.filter(u => u.role === 'MANAGER').length,
    viewers: users.filter(u => u.role === 'VIEWER').length,
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: newStatus } : u
    ));
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Managers</p>
            <p className="text-2xl font-bold text-blue-600">{stats.managers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Viewers</p>
            <p className="text-2xl font-bold text-green-600">{stats.viewers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const RoleIcon = roleIcons[user.role as keyof typeof roleIcons];
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {user.avatar}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RoleIcon className="w-4 h-4 mr-1 text-gray-500" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleBadgeColors[user.role as keyof typeof roleBadgeColors]}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="Edit User">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className={`${user.status === 'active' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                            title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found matching your filters</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
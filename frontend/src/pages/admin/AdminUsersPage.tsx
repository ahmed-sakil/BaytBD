import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  KeyRound,
  Mail,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ImageUpload } from '../../components/admin/ImageUpload';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'ORDER_MANAGER' | 'BUSINESS_MANAGER';
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ROLE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; description: string }
> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    badgeClass: 'bg-slate-900 text-white border-slate-800',
    description: 'Full unrestricted platform access, security & staff management',
  },
  ADMIN: {
    label: 'Administrator',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Operational control across Agro, Development, IT and CMS',
  },
  ORDER_MANAGER: {
    label: 'Order Manager',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Agro produce catalog, inventory control & order fulfillment',
  },
  BUSINESS_MANAGER: {
    label: 'Business Manager',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Real estate portfolio, property leads & Bayt IT solutions',
  },
  CONTENT_MANAGER: {
    label: 'Content Manager',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Corporate news, leadership directory, vacancies & applicants',
  },
};

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ORDER_MANAGER' as StaffUser['role'],
    avatar: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getUsers();
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err: any) {
      toast.error('Failed to load staff users', {
        description: err.response?.data?.message || 'Please check your permissions.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'ORDER_MANAGER',
      avatar: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (target: StaffUser) => {
    setEditingUser(target);
    setFormData({
      name: target.name,
      email: target.email,
      password: '', // Blank unless changing
      role: target.role,
      avatar: target.avatar || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        const payload: any = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: formData.avatar || null,
        };
        if (formData.password && formData.password.trim().length >= 6) {
          payload.password = formData.password.trim();
        }

        const res = await userApi.updateUser(editingUser.id, payload);
        if (res.success) {
          toast.success('Staff Member Updated', {
            description: `${res.user.name}'s account details have been updated.`,
          });
          setModalOpen(false);
          fetchUsers();
        }
      } else {
        if (!formData.password || formData.password.length < 6) {
          toast.error('Validation Error', {
            description: 'Password must be at least 6 characters.',
          });
          setSubmitting(false);
          return;
        }

        const res = await userApi.createUser(formData);
        if (res.success) {
          toast.success('Staff Member Invited', {
            description: `Account for ${res.user.name} was created successfully.`,
          });
          setModalOpen(false);
          fetchUsers();
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Could not save staff account.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (target: StaffUser) => {
    try {
      const res = await userApi.toggleStatus(target.id);
      if (res.success) {
        toast.success(res.message);
        setUsers((prev) =>
          prev.map((u) => (u.id === target.id ? { ...u, isActive: res.user.isActive } : u))
        );
      }
    } catch (err: any) {
      toast.error('Failed to change status', {
        description: err.response?.data?.message || 'Action denied.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await userApi.deleteUser(id);
      if (res.success) {
        toast.success('Staff Account Removed', {
          description: 'Account and associated permissions deleted permanently.',
        });
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete account', {
        description: err.response?.data?.message || 'Operation denied.',
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Control Bar: Responsive for Short Devices */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-700 bg-white"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-700"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Administrator</option>
              <option value="ORDER_MANAGER">Order Manager</option>
              <option value="BUSINESS_MANAGER">Business Manager</option>
              <option value="CONTENT_MANAGER">Content Manager</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchUsers}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-slate-600"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-300" />
                    Loading staff directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No staff users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleConfig = ROLE_CONFIG[u.role] || {
                    label: u.role,
                    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                    description: '',
                  };
                  const isSelf = currentUser?.id === u.id;
                  const canManage =
                    currentUser?.role === 'SUPER_ADMIN' ||
                    (currentUser?.role === 'ADMIN' && u.role !== 'SUPER_ADMIN');

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              u.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal border border-slate-200">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex flex-col items-start">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${roleConfig.badgeClass}`}
                          >
                            {roleConfig.label}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate">
                            {roleConfig.description}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          disabled={!canManage || isSelf}
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
                            u.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          } ${!canManage || isSelf ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                          title={
                            isSelf
                              ? 'Cannot deactivate own account'
                              : canManage
                              ? 'Click to toggle account status'
                              : 'Super Admin permission required'
                          }
                        >
                          {u.isActive ? (
                            <>
                              <UserCheck className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="w-3 h-3" />
                              Suspended
                            </>
                          )}
                        </button>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => openEditModal(u)}
                            disabled={!canManage}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition disabled:opacity-30 disabled:pointer-events-none"
                            title="Edit details & role"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {currentUser?.role === 'SUPER_ADMIN' && !isSelf && (
                            <button
                              onClick={() => setDeleteConfirmId(u.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 z-10 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Remove Staff Account?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This staff user will permanently lose all access to the BaytBD administrative
              portal.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingUser ? 'Edit Staff Account' : 'Invite New Staff Member'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure identity, granular permissions, and operational role.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Tariqul Islam"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@baytbd.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {editingUser
                    ? 'New Password (leave blank to retain current)'
                    : 'Temporary Password *'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '••••••••' : 'Minimum 6 characters'}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-700"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Operational Role (RBAC) *
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(ROLE_CONFIG).map(([roleKey, cfg]) => {
                    // Disable SUPER_ADMIN selection if logged-in user is not SUPER_ADMIN
                    const isSuperAdminOption = roleKey === 'SUPER_ADMIN';
                    const disabled =
                      isSuperAdminOption && currentUser?.role !== 'SUPER_ADMIN';

                    return (
                      <label
                        key={roleKey}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                          formData.role === roleKey
                            ? 'border-slate-800 bg-slate-50/90 ring-1 ring-slate-800'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={roleKey}
                          disabled={disabled}
                          checked={formData.role === roleKey}
                          onChange={() =>
                            setFormData({ ...formData, role: roleKey as StaffUser['role'] })
                          }
                          className="mt-0.5 text-slate-900 focus:ring-slate-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{cfg.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${cfg.badgeClass}`}>
                              {roleKey}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {cfg.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Profile Photo / Avatar with Cloudinary Direct Upload */}
              <ImageUpload
                label="Staff Profile Photo (Optional)"
                value={formData.avatar}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                placeholder="https://..."
                helperText="Upload avatar directly to Cloudinary or leave blank for initials"
              />

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingUser
                    ? 'Update Account'
                    : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

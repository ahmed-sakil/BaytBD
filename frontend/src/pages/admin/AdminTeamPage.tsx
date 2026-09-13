import React, { useEffect, useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../../services/api';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminTeamPage: React.FC = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: 'EXECUTIVE',
    bio: '',
    image: '',
    sortOrder: '0',
  });

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await cmsApi.getTeam();
      if (res.success) {
        setMembers(res.team);
      }
    } catch (err: any) {
      toast.error('Failed to load team', {
        description: err.response?.data?.message || 'Could not fetch team directory.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      department: 'EXECUTIVE',
      bio: '',
      image: '',
      sortOrder: String(members.length + 1),
    });
    setModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio || '',
      image: member.image || '',
      sortOrder: String(member.sortOrder ?? 0),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Missing Required Fields', {
        description: 'Please provide the member name and designation role.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingMember) {
        const res = await cmsApi.updateTeamMember(editingMember.id, formData);
        if (res.success) {
          toast.success('Member Profile Updated', {
            description: `Successfully updated ${res.member.name}.`,
          });
          setMembers((prev) =>
            prev.map((m) => (m.id === editingMember.id ? res.member : m))
          );
          setModalOpen(false);
        }
      } else {
        const res = await cmsApi.createTeamMember(formData);
        if (res.success) {
          toast.success('Team Member Registered', {
            description: `Successfully added ${res.member.name} to leadership roster.`,
          });
          setMembers((prev) => [...prev, res.member]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Error saving team member.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await cmsApi.deleteTeamMember(id);
      if (res.success) {
        toast.success('Member Profile Deleted', {
          description: 'Team member profile removed successfully.',
        });
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete member.',
      });
    }
  };

  const filteredMembers = members.filter((m) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(term) || m.role.toLowerCase().includes(term);
    const matchesDept =
      selectedDept === 'ALL' || m.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search & Action Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
            >
              <option value="ALL">All Departments ({members.length})</option>
              <option value="EXECUTIVE">Executive Board</option>
              <option value="AGRO">Bayt Agro</option>
              <option value="DEVELOPMENT">Bayt Development</option>
              <option value="IT">Bayt IT</option>
            </select>
          </div>

          <button
            onClick={fetchTeam}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs text-xs"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading team profiles...</div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No team members found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Sort Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={m.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={m.name}
                          className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                            {m.bio || 'Leadership profile'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {m.role}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {m.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      #{m.sortOrder}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === m.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(m.id)}
                              className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(m.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add / Edit Member */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => !submitting && setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingMember ? 'Edit Leadership Profile' : 'Register Team Member'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingMember
                    ? `Updating parameters for ${editingMember.name}`
                    : 'Add a new executive or department leader to the corporate directory.'}
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
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dr. Farhana Rahman"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Managing Director & CEO"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="EXECUTIVE">Executive Board</option>
                    <option value="AGRO">Bayt Agro</option>
                    <option value="DEVELOPMENT">Bayt Development</option>
                    <option value="IT">Bayt IT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label="Member Profile Photo"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Upload professional headshot directly to Cloudinary or paste an image URL"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Biography / Overview</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Professional credentials, degrees, prior leadership experience..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

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
                  {submitting ? 'Saving...' : editingMember ? 'Update Profile' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;

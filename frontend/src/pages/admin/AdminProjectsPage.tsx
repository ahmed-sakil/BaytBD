import React, { useEffect, useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { devApi } from '../../services/api';
import { DevelopmentProject } from '../../types';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DevelopmentProject | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    projectType: 'RESIDENTIAL',
    status: 'ONGOING',
    location: '',
    city: 'Dhaka',
    landArea: '',
    numberOfFloors: '',
    units: '',
    parking: '',
    completionDate: '',
    featuredImage: '',
    description: '',
    isFeatured: false,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await devApi.getProjects();
      if (res.success) {
        setProjects(res.projects);
      }
    } catch (err: any) {
      toast.error('Failed to load projects', {
        description: err.response?.data?.message || 'Could not fetch development data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      projectType: 'RESIDENTIAL',
      status: 'ONGOING',
      location: '',
      city: 'Dhaka',
      landArea: '',
      numberOfFloors: '',
      units: '',
      parking: '',
      completionDate: '',
      featuredImage: '',
      description: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (project: DevelopmentProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      projectType: project.projectType,
      status: project.status,
      location: project.location,
      city: project.city,
      landArea: project.landArea || '',
      numberOfFloors: project.numberOfFloors ? String(project.numberOfFloors) : '',
      units: project.units ? String(project.units) : '',
      parking: project.parking ? String(project.parking) : '',
      completionDate: project.completionDate || '',
      featuredImage: project.featuredImage || '',
      description: project.description || '',
      isFeatured: project.isFeatured || false,
    });
    setModalOpen(true);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      toast.error('Missing Required Fields', {
        description: 'Please provide a project title and location address.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingProject) {
        const res = await devApi.updateProject(editingProject.id, formData);
        if (res.success) {
          toast.success('Project Updated', {
            description: `Successfully updated ${res.project.title}.`,
          });
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProject.id ? res.project : p))
          );
          setModalOpen(false);
        }
      } else {
        const res = await devApi.createProject(formData);
        if (res.success) {
          toast.success('Project Created', {
            description: `Successfully added ${res.project.title} to portfolio.`,
          });
          setProjects((prev) => [res.project, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Error saving project.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      const res = await devApi.deleteProject(projectId);
      if (res.success) {
        toast.success('Project Removed', {
          description: 'The real estate project was removed from portfolio.',
        });
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete project.',
      });
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || project.status === statusFilter;
    const matchesType =
      typeFilter === 'ALL' || project.projectType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Filter and Search Bar: Responsive for Short Devices */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, location, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
          >
            <option value="ALL">All Statuses ({projects.length})</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="UPCOMING">Upcoming</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
          >
            <option value="ALL">All Types</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="SHOPPING_MALL">Shopping Mall</option>
            <option value="MIXED_USE">Mixed Use</option>
          </select>

          <button
            onClick={fetchProjects}
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
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table with Enhanced Hover Effects */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading property projects...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No property projects match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 min-w-[700px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Development Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Property Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Specifications</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => {
                  return (
                    <tr
                      key={proj.id}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={proj.featuredImage}
                            alt={proj.title}
                            className="w-12 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-xs">
                              {proj.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Slug: {proj.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1 font-medium text-slate-800">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">{proj.location}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{proj.city}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {proj.projectType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                            proj.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : proj.status === 'ONGOING'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {proj.numberOfFloors && (
                          <div>
                            <span className="font-medium text-slate-700">Floors:</span>{' '}
                            {proj.numberOfFloors}
                          </div>
                        )}
                        {proj.units && (
                          <div>
                            <span className="font-medium text-slate-700">Units:</span>{' '}
                            {proj.units}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {proj.isFeatured ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-slate-100">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(proj);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === proj.id ? (
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDelete(proj.id)}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(proj.id);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}
      </div>

      {/* Modal Dialog: Add / Edit Project with Max Height & Scroll for Short Devices */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => !submitting && setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingProject ? 'Edit Real Estate Project' : 'Register Development Project'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingProject
                    ? `Updating parameters for ${editingProject.title}`
                    : 'Add a new real estate development project to the public portfolio.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Bayt Lumina Tower"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) =>
                      setFormData({ ...formData, projectType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="SHOPPING_MALL">Shopping Mall</option>
                    <option value="MIXED_USE">Mixed Use</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="UPCOMING">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Plot 42, Road 11, Banani"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Dhaka"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.numberOfFloors}
                    onChange={(e) =>
                      setFormData({ ...formData, numberOfFloors: e.target.value })
                    }
                    placeholder="e.g., 18"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.units}
                    onChange={(e) =>
                      setFormData({ ...formData, units: e.target.value })
                    }
                    placeholder="e.g., 36"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Land Area
                  </label>
                  <input
                    type="text"
                    value={formData.landArea}
                    onChange={(e) =>
                      setFormData({ ...formData, landArea: e.target.value })
                    }
                    placeholder="e.g., 15 Katha"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Completion Date
                  </label>
                  <input
                    type="text"
                    value={formData.completionDate}
                    onChange={(e) =>
                      setFormData({ ...formData, completionDate: e.target.value })
                    }
                    placeholder="e.g., December 2026"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Featured Project Image"
                    value={formData.featuredImage}
                    onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                    placeholder="https://images.unsplash.com/..."
                    helperText="Upload architectural or development rendering directly to Cloudinary or paste an image URL"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Architectural overview, amenities, structural specifications..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isProjFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded-md text-slate-900 focus:ring-slate-500 w-4 h-4"
                  />
                  <label
                    htmlFor="isProjFeatured"
                    className="font-medium text-slate-700 cursor-pointer select-none"
                  >
                    Feature this landmark project on the Real Estate portal
                  </label>
                </div>
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
                  {submitting
                    ? 'Saving...'
                    : editingProject
                    ? 'Update Project'
                    : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsPage;

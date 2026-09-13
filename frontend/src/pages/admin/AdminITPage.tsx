import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  FolderGit2,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { itApi } from '../../services/api';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminITPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PROJECTS'>('SERVICES');
  const [services, setServices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Service Modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    iconName: 'Code2',
    features: '',
    technologies: '',
    isFeatured: false,
  });

  // Project / Case Study Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    industry: 'FinTech',
    clientName: '',
    featuredImage: '',
    summary: '',
    challenges: '',
    solutions: '',
    results: '',
    liveUrl: '',
    technologies: '',
    isFeatured: false,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, projectsRes] = await Promise.all([
        itApi.getServices(),
        itApi.getProjects(),
      ]);
      if (servicesRes.success) setServices(servicesRes.services);
      if (projectsRes.success) setProjects(projectsRes.projects);
    } catch (err: any) {
      toast.error('Failed to load IT data', {
        description: err.response?.data?.message || 'Could not fetch services or case studies.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- SERVICE ACTIONS ---
  const openCreateService = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      shortDesc: '',
      fullDesc: '',
      iconName: 'Code2',
      features: '',
      technologies: '',
      isFeatured: false,
    });
    setServiceModalOpen(true);
  };

  const openEditService = (srv: any) => {
    setEditingService(srv);
    setServiceForm({
      title: srv.title,
      shortDesc: srv.shortDesc,
      fullDesc: srv.fullDesc || srv.shortDesc,
      iconName: srv.iconName || 'Code2',
      features: Array.isArray(srv.features) ? srv.features.join('\n') : '',
      technologies: Array.isArray(srv.technologies) ? srv.technologies.join(', ') : '',
      isFeatured: srv.isFeatured ?? false,
    });
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.shortDesc) {
      toast.error('Missing Required Fields', { description: 'Please provide service title and description.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      ...serviceForm,
      features: serviceForm.features.split('\n').map((f) => f.trim()).filter(Boolean),
      technologies: serviceForm.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingService) {
        const res = await itApi.updateService(editingService.id, payload);
        if (res.success) {
          toast.success('Service Updated', { description: `Successfully updated ${res.service.title}.` });
          setServices((prev) => prev.map((s) => (s.id === editingService.id ? res.service : s)));
          setServiceModalOpen(false);
        }
      } else {
        const res = await itApi.createService(payload);
        if (res.success) {
          toast.success('Service Registered', { description: `Successfully created ${res.service.title}.` });
          setServices((prev) => [...prev, res.service]);
          setServiceModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', { description: err.response?.data?.message || 'Error saving service.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const res = await itApi.deleteService(id);
      if (res.success) {
        toast.success('Service Removed', { description: 'IT service deleted.' });
        setServices((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', { description: err.response?.data?.message || 'Could not delete service.' });
    }
  };

  // --- PROJECT ACTIONS ---
  const openCreateProject = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      industry: 'FinTech & Banking',
      clientName: '',
      featuredImage: '',
      summary: '',
      challenges: '',
      solutions: '',
      results: '',
      liveUrl: '',
      technologies: '',
      isFeatured: false,
    });
    setProjectModalOpen(true);
  };

  const openEditProject = (proj: any) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      industry: proj.industry,
      clientName: proj.clientName || '',
      featuredImage: proj.featuredImage || '',
      summary: proj.summary,
      challenges: proj.challenges || '',
      solutions: proj.solutions || '',
      results: proj.results || '',
      liveUrl: proj.liveUrl || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : '',
      isFeatured: proj.isFeatured ?? false,
    });
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.summary) {
      toast.error('Missing Required Fields', { description: 'Please provide case study title and summary.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingProject) {
        const res = await itApi.updateProject(editingProject.id, payload);
        if (res.success) {
          toast.success('Case Study Updated', { description: `Successfully updated ${res.project.title}.` });
          setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? res.project : p)));
          setProjectModalOpen(false);
        }
      } else {
        const res = await itApi.createProject(payload);
        if (res.success) {
          toast.success('Case Study Published', { description: `Successfully created ${res.project.title}.` });
          setProjects((prev) => [...prev, res.project]);
          setProjectModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', { description: err.response?.data?.message || 'Error saving case study.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await itApi.deleteProject(id);
      if (res.success) {
        toast.success('Case Study Removed', { description: 'Portfolio case study deleted.' });
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', { description: err.response?.data?.message || 'Could not delete project.' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Tab Switcher & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('SERVICES')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'SERVICES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Capabilities & Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('PROJECTS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'PROJECTS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portfolio Case Studies ({projects.length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs text-xs"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {activeTab === 'SERVICES' ? (
            <button
              onClick={openCreateService}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add IT Service</span>
            </button>
          ) : (
            <button
              onClick={openCreateProject}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Case Study</span>
            </button>
          )}
        </div>
      </div>

      {/* Services Table */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
              <div>Loading IT services...</div>
            </div>
          ) : services.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Cpu className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No IT services registered yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Service Domain</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Tech Stack</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((srv) => (
                    <tr
                      key={srv.id}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span>{srv.title}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="line-clamp-2 text-slate-600 text-[11px]">{srv.shortDesc}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {((srv.technologies as string[]) || []).slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {srv.isFeatured ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-white">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditService(srv)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                            title="Edit Service"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === srv.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteService(srv.id)}
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
                              onClick={() => setDeleteConfirmId(srv.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                              title="Delete Service"
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
      )}

      {/* Projects Table */}
      {activeTab === 'PROJECTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
              <div>Loading case studies...</div>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <FolderGit2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No case studies registered yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Case Study</th>
                    <th className="py-3 px-4">Industry / Client</th>
                    <th className="py-3 px-4">Tech Stack</th>
                    <th className="py-3 px-4">Live URL</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((proj) => (
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
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {proj.title}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{proj.summary}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{proj.industry}</div>
                        {proj.clientName && <div className="text-[11px] text-slate-400">{proj.clientName}</div>}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {((proj.technologies as string[]) || []).slice(0, 3).map((t, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-blue-600">
                        {proj.liveUrl ? (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:underline">
                            <span className="truncate max-w-[120px]">{proj.liveUrl.replace('https://', '')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditProject(proj)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                            title="Edit Case Study"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === proj.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteProject(proj.id)}
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
                              onClick={() => setDeleteConfirmId(proj.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                              title="Delete Case Study"
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
      )}

      {/* Modal: Service Add / Edit */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={() => !submitting && setServiceModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingService ? 'Edit IT Service' : 'Add IT Capability'}
                </h3>
                <p className="text-[11px] text-slate-500">Service domain offered by Bayt IT Solutions.</p>
              </div>
              <button onClick={() => setServiceModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g., Enterprise Cloud Migration"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={serviceForm.shortDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  placeholder="Brief capabilities summary..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={serviceForm.technologies}
                  onChange={(e) => setServiceForm({ ...serviceForm, technologies: e.target.value })}
                  placeholder="AWS, Kubernetes, Terraform, Docker"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Features (one per line)</label>
                <textarea
                  rows={3}
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  placeholder="99.99% SLA Uptime Guarantee&#10;Sub-100ms Latency Architecture&#10;Automated Disaster Recovery"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="srvFeatured"
                  checked={serviceForm.isFeatured}
                  onChange={(e) => setServiceForm({ ...serviceForm, isFeatured: e.target.checked })}
                  className="rounded-md text-slate-900 focus:ring-slate-500 w-4 h-4"
                />
                <label htmlFor="srvFeatured" className="font-medium text-slate-700 cursor-pointer select-none">
                  Highlight this capability on the IT portal home screen
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setServiceModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition disabled:opacity-50">
                  {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Project Add / Edit */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" onClick={() => !submitting && setProjectModalOpen(false)} />
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingProject ? 'Edit Case Study' : 'Publish IT Case Study'}
                </h3>
                <p className="text-[11px] text-slate-500">Showcase enterprise engineering achievements.</p>
              </div>
              <button onClick={() => setProjectModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Project / Case Study Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g., Core Banking Modernization"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <input
                    type="text"
                    value={projectForm.industry}
                    onChange={(e) => setProjectForm({ ...projectForm, industry: e.target.value })}
                    placeholder="FinTech, Health, Telecom..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client Name (Optional)</label>
                  <input
                    type="text"
                    value={projectForm.clientName}
                    onChange={(e) => setProjectForm({ ...projectForm, clientName: e.target.value })}
                    placeholder="e.g., Global Trust Bank"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Featured Project Image"
                    value={projectForm.featuredImage}
                    onChange={(url) => setProjectForm({ ...projectForm, featuredImage: url })}
                    placeholder="https://images.unsplash.com/..."
                    helperText="Upload case study or system screenshot directly to Cloudinary or paste an image URL"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Summary Overview *</label>
                  <textarea
                    rows={2}
                    required
                    value={projectForm.summary}
                    onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                    placeholder="Executive brief of the system delivered..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Live Demo / Product URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    placeholder="React, Golang, PostgreSQL, Redis"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Challenges</label>
                  <textarea
                    rows={2}
                    value={projectForm.challenges}
                    onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })}
                    placeholder="Legacy bottlenecks, throughput limitations..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Solution Delivered</label>
                  <textarea
                    rows={2}
                    value={projectForm.solutions}
                    onChange={(e) => setProjectForm({ ...projectForm, solutions: e.target.value })}
                    placeholder="Microservices redesign, streaming ETL pipeline..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setProjectModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition disabled:opacity-50">
                  {submitting ? 'Saving...' : editingProject ? 'Update Case Study' : 'Publish Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminITPage;

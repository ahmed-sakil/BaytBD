import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../../services/api';

export const AdminCareersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'JOBS' | 'APPLICATIONS'>('JOBS');
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Jobs
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal State for viewing Application details
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: 'CORPORATE',
    location: 'Dhaka, Bangladesh',
    employmentType: 'Full-time',
    description: '',
    requirements: '',
    deadline: '',
    isActive: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        cmsApi.getJobs(),
        cmsApi.getJobApplications(),
      ]);
      if (jobsRes.success) setJobs(jobsRes.jobs);
      if (appsRes.success) setApplications(appsRes.applications);
    } catch (err: any) {
      toast.error('Failed to load career data', {
        description: err.response?.data?.message || 'Could not fetch jobs or applications.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: 'CORPORATE',
      location: 'Dhaka, Bangladesh',
      employmentType: 'Full-time',
      description: '',
      requirements: '',
      deadline: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
      isActive: job.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Missing Required Fields', {
        description: 'Please provide job title and description.',
      });
      return;
    }

    setSubmitting(true);
    const reqArray = formData.requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      requirements: reqArray,
    };

    try {
      if (editingJob) {
        const res = await cmsApi.updateJob(editingJob.id, payload);
        if (res.success) {
          toast.success('Job Opening Updated', {
            description: `Successfully updated ${res.job.title}.`,
          });
          setJobs((prev) => (prev.map((j) => (j.id === editingJob.id ? res.job : j))));
          setModalOpen(false);
        }
      } else {
        const res = await cmsApi.createJob(payload);
        if (res.success) {
          toast.success('Job Opening Published', {
            description: `Successfully posted ${res.job.title}.`,
          });
          setJobs((prev) => [res.job, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Error saving job opening.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const res = await cmsApi.deleteJob(id);
      if (res.success) {
        toast.success('Job Removed', {
          description: 'Job posting deleted successfully.',
        });
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete job post.',
      });
    }
  };

  const handleUpdateAppStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await cmsApi.updateJobApplicationStatus(appId, { status: newStatus });
      if (res.success) {
        toast.success('Application Status Updated', {
          description: `Applicant marked as ${newStatus}.`,
        });
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
        );
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      }
    } catch (err: any) {
      toast.error('Status Update Failed', {
        description: err.response?.data?.message || 'Could not update applicant status.',
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Tab Switcher & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('JOBS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'JOBS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Vacancies ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'APPLICATIONS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Candidate Submissions ({applications.length})
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
          {activeTab === 'JOBS' && (
            <button
              onClick={openCreateModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Vacancy</span>
            </button>
          )}
        </div>
      </div>

      {/* View 1: Job Openings Table */}
      {activeTab === 'JOBS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
              <div>Loading employment vacancies...</div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No vacancies currently posted.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Position</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                        <div className="text-[10px] text-slate-400 font-normal">
                          {job.applications?.length || 0} candidate(s) applied
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {job.department}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {job.employmentType}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open Rolling'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => openEditModal(job)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                            title="Edit Vacancy"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === job.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleDeleteJob(job.id)}
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
                              onClick={() => setDeleteConfirmId(job.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                              title="Delete Vacancy"
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

      {/* View 2: Candidate Applications Table */}
      {activeTab === 'APPLICATIONS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
              <div>Loading applicant submissions...</div>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No applicant submissions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Applicant Name</th>
                    <th className="py-3 px-4">Target Position</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.applicantName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {app.job?.title || 'General Application'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-mono text-[11px]">{app.phone}</div>
                        <div className="text-slate-400 text-[10px]">{app.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border focus:outline-none ${
                            app.status === 'SHORTLISTED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : app.status === 'REVIEWING'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                          title="View Application Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Dialog: Add / Edit Job Vacancy */}
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
                  {editingJob ? 'Edit Vacancy' : 'Post New Job Vacancy'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingJob ? `Updating requirements for ${editingJob.title}` : 'Publish an employment vacancy across the public Careers portal.'}
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
                <label className="block font-semibold text-slate-700 mb-1">Job Title / Role *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Cloud Architect"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="CORPORATE">Corporate</option>
                    <option value="AGRO">Bayt Agro</option>
                    <option value="DEVELOPMENT">Bayt Development</option>
                    <option value="IT">Bayt IT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Office Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Gulshan-2, Dhaka"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of core duties, key objectives, and day-to-day responsibilities..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
                <textarea
                  rows={4}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="5+ years experience in distributed systems&#10;Proficiency in Go, Node.js or Rust&#10;B.Sc. in Computer Science or relevant field"
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
                  {submitting ? 'Saving...' : editingJob ? 'Update Vacancy' : 'Post Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: View Candidate Application Details */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedApp(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Applicant Dossier</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Applied on {new Date(selectedApp.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Candidate Info
                </div>
                <div className="font-bold text-slate-900 text-sm">{selectedApp.applicantName}</div>
                <div className="flex items-center space-x-1.5 text-slate-600 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedApp.phone}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedApp.email}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Role
                </div>
                <div className="font-semibold text-slate-900">{selectedApp.job?.title || 'Open Application'}</div>
              </div>

              {selectedApp.resumeUrl && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Curriculum Vitae / Resume</span>
                  </div>
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <span>View Resume</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {selectedApp.coverLetter && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Candidate Statement / Cover Letter
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed pt-1">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Application Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-white"
                >
                  <option value="NEW">NEW</option>
                  <option value="REVIEWING">REVIEWING</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareersPage;

import React, { useEffect, useState } from 'react';
import {
  Mail,
  Search,
  RefreshCw,
  Eye,
  X,
  Phone,
  Building2,
  MessageSquare,
  Printer,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  Laptop,
} from 'lucide-react';
import { toast } from 'sonner';
import { devApi, cmsApi } from '../../services/api';
import { InquirySummaryModal } from '../../components/admin/InquirySummaryModal';

type InquiryTab = 'GENERAL_IT' | 'PROPERTY';

export const AdminInquiriesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InquiryTab>('GENERAL_IT');

  // General & IT Consultations State
  const [generalInquiries, setGeneralInquiries] = useState<any[]>([]);
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Property Leads State
  const [propertyInquiries, setPropertyInquiries] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [dossierInquiry, setDossierInquiry] = useState<any | null>(null);

  const fetchGeneralInquiries = async () => {
    try {
      const params = deptFilter !== 'ALL' ? { departmentTarget: deptFilter } : undefined;
      const res = await cmsApi.getAdminGeneralInquiries(params);
      if (res.success) {
        setGeneralInquiries(res.inquiries || []);
      }
    } catch (err: any) {
      toast.error('Failed to load consultation inquiries', {
        description: err.response?.data?.message || 'Please check connection.',
      });
    }
  };

  const fetchPropertyInquiries = async () => {
    try {
      const res = await devApi.getAdminInquiries();
      if (res.success) {
        setPropertyInquiries(res.inquiries || []);
      }
    } catch (err: any) {
      toast.error('Failed to load property leads', {
        description: err.response?.data?.message || 'Please check connection.',
      });
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchGeneralInquiries(), fetchPropertyInquiries()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, [deptFilter]);

  const handleUpdateGeneralStatus = async (id: string, newStatus: string) => {
    try {
      const res = await cmsApi.updateGeneralInquiryStatus(id, { status: newStatus });
      if (res.success) {
        toast.success(`Inquiry status updated to ${newStatus}`);
        setGeneralInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (err: any) {
      toast.error('Failed to update status', {
        description: err.response?.data?.message || 'Action failed.',
      });
    }
  };

  // Filtering for General Consultations
  const filteredGeneral = generalInquiries.filter((inq) => {
    const term = searchQuery.toLowerCase();
    const matchesDept = deptFilter === 'ALL' || inq.departmentTarget === deptFilter;
    const matchesSearch =
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.phone?.toLowerCase().includes(term) ||
      inq.company?.toLowerCase().includes(term) ||
      inq.subject?.toLowerCase().includes(term) ||
      inq.message?.toLowerCase().includes(term);
    return matchesDept && matchesSearch;
  });

  // Filtering for Property Leads
  const filteredProperty = propertyInquiries.filter((inq) => {
    const term = searchQuery.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.phone?.includes(term) ||
      (inq.project?.title && inq.project.title.toLowerCase().includes(term)) ||
      (inq.message && inq.message.toLowerCase().includes(term))
    );
  });

  const getDeptBadgeClass = (dept: string) => {
    switch (dept) {
      case 'IT':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'AGRO':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DEVELOPMENT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PARTNERSHIP':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('GENERAL_IT')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'GENERAL_IT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-700" />
            <span>Client & Partner Inquiries</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {generalInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PROPERTY')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeTab === 'PROPERTY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Property Inquiries</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
              {propertyInquiries.length}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={loadAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs text-xs font-medium"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'GENERAL_IT'
                ? 'Search consultations by name, email, company, subject...'
                : 'Search property leads by client name, email, project...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        {/* Department Filter Pills (For General & IT Tab) */}
        {activeTab === 'GENERAL_IT' && (
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center">
              <Layers className="w-3 h-3 mr-1" /> Unit:
            </span>
            {['ALL', 'PARTNERSHIP', 'IT', 'CORPORATE', 'AGRO', 'DEVELOPMENT'].map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap border ${
                  deptFilter === dept
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dept === 'ALL'
                  ? 'All Inquiries'
                  : dept === 'PARTNERSHIP'
                  ? 'Partner Requests'
                  : dept === 'IT'
                  ? 'Bayt IT'
                  : dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading inquiries...</div>
          </div>
        ) : activeTab === 'GENERAL_IT' ? (
          /* GENERAL & IT CONSULTATIONS TABLE */
          filteredGeneral.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No consultations found matching your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[750px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Target Unit</th>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Subject & Message</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGeneral.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry({ ...inq, type: 'GENERAL' })}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getDeptBadgeClass(
                            inq.departmentTarget
                          )}`}
                        >
                          {inq.departmentTarget === 'IT'
                            ? 'Bayt IT'
                            : inq.departmentTarget === 'PARTNERSHIP'
                            ? 'Partner Request'
                            : inq.departmentTarget}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inq.name}</div>
                        {inq.company && (
                          <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>{inq.company}</span>
                          </div>
                        )}
                        <div className="text-slate-500 font-mono text-[11px]">{inq.email}</div>
                        {inq.phone && (
                          <div className="text-slate-400 font-mono text-[10px]">{inq.phone}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                        <div className="font-semibold text-slate-900 truncate mb-0.5">
                          {inq.subject}
                        </div>
                        <p className="line-clamp-2 text-slate-500 text-[11px]">{inq.message}</p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${
                            inq.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : inq.status === 'IN_PROGRESS'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center space-x-1">
                          {inq.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateGeneralStatus(inq.id, 'RESOLVED')}
                              className="p-1.5 rounded-lg border border-slate-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition"
                              title="Mark as Resolved"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {inq.status === 'NEW' && (
                            <button
                              onClick={() => handleUpdateGeneralStatus(inq.id, 'IN_PROGRESS')}
                              className="p-1.5 rounded-lg border border-slate-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition"
                              title="Mark as In Progress"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInquiry({ ...inq, type: 'GENERAL' })}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="View Full Consultation Message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* PROPERTY LEADS TABLE */
          filteredProperty.length === 0 ? (
            <div className="py-20 text-center text-xs text-slate-500">
              <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No property leads match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Target Property</th>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Message Excerpt</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperty.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry({ ...inq, type: 'PROPERTY' })}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {inq.project?.title ? (
                          <div className="flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-xs group-hover:text-blue-600 transition-colors">
                              {inq.project.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-normal">General Consultation</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{inq.name}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{inq.phone}</div>
                        <div className="text-slate-400 text-[10px]">{inq.email}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="line-clamp-2 text-slate-600 text-[11px]">{inq.message}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => setDossierInquiry(inq)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Print Property Lead Dossier"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedInquiry({ ...inq, type: 'PROPERTY' })}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="View Full Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedInquiry(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {selectedInquiry.type === 'GENERAL'
                    ? selectedInquiry.departmentTarget === 'PARTNERSHIP'
                      ? 'Strategic Partnership Request'
                      : selectedInquiry.departmentTarget === 'IT'
                      ? 'Bayt IT Consultation'
                      : `${selectedInquiry.departmentTarget} Consultation`
                    : 'Property Lead Details'}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Contact Information
                </div>
                <div className="font-bold text-slate-900 text-sm">{selectedInquiry.name}</div>
                {selectedInquiry.company && (
                  <div className="flex items-center space-x-1.5 text-slate-700">
                    <Briefcase className="w-3 h-3 text-slate-400" />
                    <span className="font-medium">{selectedInquiry.company}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedInquiry.email}</span>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center space-x-1.5 text-slate-600 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{selectedInquiry.phone}</span>
                  </div>
                )}
              </div>

              {selectedInquiry.type === 'GENERAL' ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Subject
                  </div>
                  <div className="font-semibold text-slate-900">{selectedInquiry.subject}</div>
                </div>
              ) : selectedInquiry.project ? (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Associated Landmark Property
                  </div>
                  <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedInquiry.project.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Location: {selectedInquiry.project.location}, {selectedInquiry.project.city}
                  </div>
                </div>
              ) : null}

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Inquiry Requirement</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed pt-1">
                  {selectedInquiry.message}
                </p>
              </div>

              {selectedInquiry.type === 'GENERAL' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Update Status:</span>
                  <div className="flex items-center space-x-1.5">
                    {['NEW', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateGeneralStatus(selectedInquiry.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition border ${
                          selectedInquiry.status === st
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {selectedInquiry.type === 'PROPERTY' ? (
                <button
                  type="button"
                  onClick={() => setDossierInquiry(selectedInquiry)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Lead Dossier</span>
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Property Lead Dossier Modal */}
      <InquirySummaryModal
        inquiry={dossierInquiry}
        onClose={() => setDossierInquiry(null)}
      />
    </div>
  );
};

export default AdminInquiriesPage;

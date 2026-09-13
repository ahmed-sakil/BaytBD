import React from 'react';
import { Printer, X, Building2, User, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { printElement } from '../../utils/printHelper';

interface InquirySummaryModalProps {
  inquiry: any | null;
  onClose: () => void;
}

export const InquirySummaryModal: React.FC<InquirySummaryModalProps> = ({ inquiry, onClose }) => {
  if (!inquiry) return null;

  const handlePrint = () => {
    printElement('inquiry-dossier-printable', `Property-Lead-${inquiry.id.slice(0, 8).toUpperCase()}`);
  };

  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 print:p-0">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 z-10 max-h-[95vh] flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Property Lead Dossier
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white border border-slate-200 text-slate-700">
              INQ-{inquiry.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          <div id="inquiry-dossier-printable" className="max-w-2xl mx-auto text-slate-900 font-sans">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-xl font-black uppercase tracking-wider text-slate-900">
                  BAYTBD GROUP
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  Bayt Development • Real Estate & Infrastructure Division
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Level 8, Bayt Tower, Gulshan-2, Dhaka 1212, Bangladesh<br />
                  Hotline: +880 9612-000000 • Email: realestate@baytbd.com • Web: www.baytbd.com
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Client Lead Dossier
                </div>
                <div className="text-xs font-mono">
                  <span className="text-slate-500">Ref:</span>{' '}
                  <span className="font-bold">INQ-{inquiry.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="text-xs font-mono mt-0.5">
                  <span className="text-slate-500">Received:</span>{' '}
                  <span>{formattedDate}</span>
                </div>
                <div className="text-xs font-mono mt-0.5">
                  <span className="text-slate-500">Status:</span>{' '}
                  <span className="font-semibold uppercase">{inquiry.status || 'NEW'}</span>
                </div>
              </div>
            </div>

            {/* Prospect Information */}
            <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Prospect Contact Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Client Name</span>
                  <span className="font-bold text-slate-900 text-sm">{inquiry.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Direct Phone</span>
                  <span className="font-mono font-semibold text-slate-900">{inquiry.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span className="text-slate-900">{inquiry.email}</span>
                </div>
              </div>
            </div>

            {/* Landmark Project Information */}
            {inquiry.project && (
              <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Landmark Property
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Project Title</span>
                    <span className="font-bold text-slate-900 text-sm">{inquiry.project.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location & City</span>
                    <span className="text-slate-900 font-medium">
                      {inquiry.project.location}, {inquiry.project.city}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-500">Project Type:</span>{' '}
                    <span className="font-semibold text-slate-800">{inquiry.project.projectType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Development Status:</span>{' '}
                    <span className="font-semibold text-slate-800">{inquiry.project.status}</span>
                  </div>
                  {inquiry.project.completionDate && (
                    <div>
                      <span className="text-slate-500">Expected Handover:</span>{' '}
                      <span className="font-semibold text-slate-800">{inquiry.project.completionDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Client Inquiry Requirements */}
            <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Client Requirements & Consultation Message</span>
              </div>
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                {inquiry.message || 'No additional message provided.'}
              </p>
            </div>

            {/* CRM Assessment & Action Plan Section */}
            <div className="mb-6 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/40 text-xs page-break-inside-avoid">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                Internal CRM Assessment & Action Plan (Confidential)
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Assigned Sales Executive:</span>
                  <div className="border-b border-slate-300 pb-1 font-medium text-slate-800">
                    __________________________________
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Scheduled Site Tour Date:</span>
                  <div className="border-b border-slate-300 pb-1 font-medium text-slate-800">
                    __________________________________
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Sales Notes & Proposed Units:</span>
                <div className="h-14 border border-slate-200 rounded-lg bg-white p-2 text-slate-400 text-[11px]">
                  Record preferred floor, unit size (sq. ft.), budget expectation, or financing terms...
                </div>
              </div>
            </div>

            {/* Sign-off */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500 page-break-inside-avoid">
              <div className="max-w-xs text-[11px] leading-relaxed">
                <p className="font-semibold text-slate-700 mb-0.5">Confidential Property Record</p>
                <p>
                  This lead document contains proprietary customer information strictly for Bayt Development sales & relationship management.
                </p>
              </div>

              <div className="text-center w-48">
                <div className="border-b border-slate-300 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                  Relationship Manager
                </div>
                <div className="font-bold text-slate-800 text-[11px]">
                  Bayt Development CRM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquirySummaryModal;

import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, CheckCircle2, ArrowRight, X, Send } from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../services/api';
import { JobPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const CareersPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.careers'));
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Application Modal state
  const [applicant, setApplicant] = useState({
    applicantName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cmsApi.getJobs().then((res) => {
      if (res.success) setJobs(res.jobs);
      setLoading(false);
    });
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      const res = await cmsApi.applyJob({
        jobId: selectedJob.id,
        ...applicant,
      });
      if (res.success) {
        toast.success('Application Received!', {
          description: `Your application for ${selectedJob.title} has been received. Our HR team will reach out to shortlisted candidates.`,
        });
        setSelectedJob(null);
        setApplicant({ applicantName: '', email: '', phone: '', resumeUrl: '', coverLetter: '' });
      }
    } catch (err: any) {
      toast.error('Submission Failed', {
        description: err.response?.data?.message || 'Error submitting application.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24">
      {/* 1. HERO BANNER */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-slate-900">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold tracking-wider uppercase shadow-inner">
            <Briefcase className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('careers.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t('careers.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('careers.heroSub')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">{t('common.loading')}</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <div className="text-base font-bold text-slate-800">{t('careers.noJobs')}</div>
          <p className="text-xs text-slate-500 mt-1">{t('careers.checkBack')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-8 hover:shadow-lg transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mb-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider">{job.department}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.employmentType}</span>
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900">{job.title}</h3>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="px-6 py-2.5 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap self-start sm:self-auto flex items-center justify-center"
                >
                  {t('careers.applyForRole')}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{job.description}</p>

              {job.requirements && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('careers.requirements')}:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {((job.requirements as string[]) || []).map((req, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">{t('careers.jobApplication')}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedJob.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedJob.department} • {selectedJob.location}</p>
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('careers.applicantName')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhana Yasmin"
                  value={applicant.applicantName}
                  onChange={(e) => setApplicant({ ...applicant, applicantName: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('careers.applicantEmail')}</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={applicant.email}
                  onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('careers.applicantPhone')}</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={applicant.phone}
                  onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('careers.resumeUrl')}</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/..."
                  value={applicant.resumeUrl}
                  onChange={(e) => setApplicant({ ...applicant, resumeUrl: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('careers.coverNote')}</label>
                <textarea
                  rows={3}
                  placeholder="Briefly state your relevant experience and why you are interested in BaytBD..."
                  value={applicant.coverLetter}
                  onChange={(e) => setApplicant({ ...applicant, coverLetter: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? t('careers.submittingApp') : t('careers.submitApplication')}</span>
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

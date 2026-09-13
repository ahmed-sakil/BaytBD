import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Send,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { devApi } from '../services/api';
import { DevelopmentProject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, formatNumber } = useLanguage();
  const [project, setProject] = useState<DevelopmentProject | null>(null);
  usePageTitle(project?.title || t('nav.development'));
  const [loading, setLoading] = useState(true);

  // Inquiry Form
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await devApi.getProjectBySlug(slug);
        if (res.success) setProject(res.project);
      } catch (err) {
        console.error('Failed to load project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    try {
      const res = await devApi.createInquiry({
        projectId: project.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
      });
      if (res.success) {
        toast.success('Inquiry Submitted Successfully!', {
          description: `Our property advisors for ${project.title} will contact you shortly.`,
        });
        setInquiry({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err: any) {
      toast.error('Submission Failed', {
        description: err.response?.data?.message || 'Could not submit inquiry. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-28 text-slate-500 text-sm">Loading architectural specifications...</div>;
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto text-center py-28 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <Link to="/development" className="inline-block px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold">
          Back to Development Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10 sm:space-y-16">
      <Link to="/development" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-amber-700 transition min-h-[44px]">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('dev.backToDev')}</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            {project.status}
          </span>
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
            {project.projectType}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {project.title}
        </h1>
        <div className="flex items-center text-xs sm:text-sm text-slate-600 space-x-2">
          <MapPin className="w-4 h-4 text-amber-700" />
          <span>{project.location}, {project.city}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="aspect-[16/9] sm:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <img src={project.featuredImage} alt={project.title} className="w-full h-full object-cover" />
      </div>

      {/* Key Architectural Specifications Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200 text-center">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase">{t('dev.landArea')}</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{project.landArea || t('dev.private')}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase">{t('dev.elevation')}</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{project.numberOfFloors || 'High-rise'}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase">{t('dev.capacity')}</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{project.units || t('dev.exclusive')}</div>
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase">{t('dev.handover')}</div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{project.completionDate || t('dev.tba')}</div>
        </div>
      </div>

      {/* Main Content & Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Description & Features */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">{t('dev.projectOverview')}</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Features Highlights */}
          {project.features && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{t('dev.structuralHighlights')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {((project.features as string[]) || []).map((f, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facilities / Amenities */}
          {project.facilities && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{t('dev.amenities')}</h3>
              <div className="flex flex-wrap gap-2">
                {((project.facilities as string[]) || []).map((fac, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-100/60 text-amber-900 text-xs font-semibold">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Showcase */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{t('dev.gallery')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((img) => (
                  <div key={img.id} className="aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img src={img.imageUrl} alt={img.caption || project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Inquiry Form */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-6 lg:sticky lg:top-28">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">{t('dev.badge')}</span>
            <h3 className="text-xl font-bold text-white mt-1">{t('dev.scheduleViewing')}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect with our property consultants to receive floor plans and brochure documents.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('contact.name')}</label>
              <input
                type="text"
                required
                placeholder="e.g. Zahid Hasan"
                value={inquiry.name}
                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                className="w-full px-3.5 h-11 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('contact.phone')}</label>
              <input
                type="tel"
                required
                placeholder="017xxxxxxxx"
                value={inquiry.phone}
                onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                className="w-full px-3.5 h-11 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('contact.email')}</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                className="w-full px-3.5 h-11 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{t('contact.message')}</label>
              <textarea
                rows={3}
                placeholder="Inquire about pricing, floor plans, or site visits..."
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] py-3 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? t('common.submitting') : t('dev.submitInquiry')}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

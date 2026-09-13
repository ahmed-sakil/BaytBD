import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Cpu, Cloud, Code2, ShieldCheck, ArrowRight, CheckCircle2, Send, Terminal, Zap, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { itApi, cmsApi } from '../services/api';
import { ITService, ITProject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const ITPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.it'));
  const location = useLocation();
  const [services, setServices] = useState<ITService[]>([]);
  const [projects, setProjects] = useState<ITProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiry Form
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'IT Project Consultation',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, projRes] = await Promise.all([
          itApi.getServices(),
          itApi.getProjects(),
        ]);
        if (servRes.success) setServices(servRes.services);
        if (projRes.success) setProjects(projRes.projects);
      } catch (err) {
        console.error('Failed to load IT data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, [location.hash, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await cmsApi.submitGeneralInquiry({
        ...form,
        departmentTarget: 'IT',
      });
      if (res.success) {
        toast.success('Consultation Request Received!', {
          description: 'Bayt IT solutions architects will review your requirements and schedule a technical discovery call.',
        });
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: 'IT Project Consultation',
          message: '',
        });
      }
    } catch (err: any) {
      toast.error('Submission Failed', {
        description: err.response?.data?.message || 'Could not submit inquiry.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. HERO BANNER */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-slate-900">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-sky-400 font-semibold tracking-wider uppercase shadow-inner">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('it.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {t('it.heroTitle')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            {t('it.heroSub')}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-300 font-mono">
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>{t('it.latencyStandard')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>{t('it.isoCert')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>{t('it.cloudArch')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IT SERVICES SHOWCASE */}
      <section id="capabilities" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 scroll-mt-28">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t('it.capabilitiesBadge')}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('it.capabilitiesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('it.capabilitiesSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-sky-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                  <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.fullDesc}
                </p>

                {/* Features */}
                {service.features && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {((service.features as string[]) || []).map((f, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Technologies */}
              {service.technologies && (
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('it.techStack')}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {((service.technologies as string[]) || []).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. CASE STUDIES SECTION */}
      <section id="case-studies" className="bg-slate-50 py-16 px-4 sm:px-8 border-y border-slate-200 scroll-mt-28">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t('it.caseStudiesBadge')}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('it.caseStudiesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('it.caseStudiesSub')}
            </p>
          </div>

          <div className="space-y-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-5 h-full">
                  <img
                    src={proj.featuredImage}
                    alt={proj.title}
                    className="w-full h-full min-h-[300px] object-cover"
                  />
                </div>
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                      {proj.industry}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500 font-semibold">{proj.clientName}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {proj.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-900 mb-1">{t('it.challenge')}</div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{proj.challenges}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-900 mb-1">{t('it.solution')}</div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{proj.solutions}</p>
                    </div>
                    <div className="bg-sky-50 p-3.5 rounded-xl border border-sky-100">
                      <div className="font-bold text-sky-900 mb-1">{t('it.impact')}</div>
                      <p className="text-sky-800 text-[11px] font-semibold leading-relaxed">{proj.results}</p>
                    </div>
                  </div>

                  {proj.technologies && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {((proj.technologies as string[]) || []).map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IT CONSULTATION INQUIRY */}
      <section id="consultation" className="max-w-4xl mx-auto px-4 sm:px-8 scroll-mt-28">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">{t('it.requestSession')}</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              {t('it.requestSub')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('it.fullName')}</label>
              <input
                type="text"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 h-11 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('it.company')}</label>
              <input
                type="text"
                placeholder="e.g. Apex Logistics Ltd."
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3.5 h-11 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('it.email')}</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 h-11 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('it.phone')}</label>
              <input
                type="tel"
                placeholder="017xxxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 h-11 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('it.scope')}</label>
              <textarea
                required
                rows={3}
                placeholder="Briefly describe your project requirements, timeline, and current tech stack..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-600 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] py-3 bg-slate-900 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? t('it.submitting') : t('it.submitBtn')}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

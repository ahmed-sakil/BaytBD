import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, MapPin, Layers, Calendar, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { devApi } from '../services/api';
import { DevelopmentProject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const DevelopmentPage: React.FC = () => {
  const { t, formatNumber } = useLanguage();
  usePageTitle(t('nav.development'));
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get('status') || 'ALL';

  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await devApi.getProjects({
          status: activeStatus !== 'ALL' ? activeStatus : undefined,
        });
        if (res.success) setProjects(res.projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [activeStatus]);

  const handleStatusTab = (status: string) => {
    if (status === 'ALL') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      {/* 1. HERO BANNER */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-slate-900">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-semibold tracking-wider uppercase shadow-inner">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('dev.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {t('dev.heroTitle')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            {t('dev.heroSub')}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t('dev.rajukCompliance')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t('dev.leedStandards')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUS TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2">
            {[
              { id: 'ALL', label: t('common.all') },
              { id: 'ONGOING', label: t('dev.ongoing') },
              { id: 'COMPLETED', label: t('dev.completed') },
              { id: 'UPCOMING', label: t('dev.upcoming') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleStatusTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  activeStatus === tab.id
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            {t('dev.showing')}{' '}
            <span className="font-bold text-slate-800">{formatNumber(projects.length)}</span>{' '}
            {t('dev.landmarks')}
          </div>
        </div>

        {/* 3. PROJECTS GRID */}
        {loading ? (
          <div className="text-center py-20 text-sm text-slate-500">{t('common.loading')}</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <div className="text-base font-bold text-slate-800">{t('dev.noProjects')}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-amber-600/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={proj.featuredImage}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className="bg-slate-900/90 backdrop-blur text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {proj.status}
                      </span>
                      <span className="bg-white/95 backdrop-blur text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {proj.projectType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center text-xs text-amber-800 font-semibold space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span>{proj.location}</span>
                    </div>

                    <Link to={`/development/projects/${proj.slug}`}>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                        {proj.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400">{t('dev.floors')}:</span> {proj.numberOfFloors || 'N/A'}
                      </div>
                      <div>
                        <span className="text-slate-400">{t('dev.units')}:</span> {proj.units || t('dev.exclusive')}
                      </div>
                      <div>
                        <span className="text-slate-400">{t('dev.landArea')}:</span> {proj.landArea || t('dev.private')}
                      </div>
                      <div>
                        <span className="text-slate-400">{t('dev.targetDate')}:</span> {proj.completionDate || t('dev.tba')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 mt-2">
                  <Link
                    to={`/development/projects/${proj.slug}`}
                    className="w-full min-h-[44px] py-3 bg-slate-900 group-hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-sm"
                  >
                    <span>{t('dev.viewSpecs')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

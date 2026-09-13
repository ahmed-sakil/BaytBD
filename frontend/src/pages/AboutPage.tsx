import React, { useEffect, useState } from 'react';
import { Target, Eye, Compass, Leaf, Building2, Cpu } from 'lucide-react';
import { cmsApi } from '../services/api';
import { TeamMember } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.about'));
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    cmsApi.getTeam().then((res) => {
      if (res.success) setTeam(res.team);
    });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 sm:pb-24">
      {/* 1. HERO */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-slate-900">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold tracking-wider uppercase shadow-inner">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Who We Are • Corporate Governance & Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t('about.heroTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('about.heroSub')}
          </p>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Eye className="w-6 h-6 text-sky-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('about.visionTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('about.visionText')}
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{t('about.missionTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('about.missionText')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. THREE STRATEGIC PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('home.pillarsBadge')}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('about.pillarsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('about.pillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-lg transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('about.pillar1Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar1Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-500/40 hover:shadow-lg transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('about.pillar2Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar2Desc')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-500/40 hover:shadow-lg transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{t('about.pillar3Title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('about.pillar3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE LEADERSHIP */}
      <section id="leadership" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t('about.leadershipTitle')}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('about.leadershipTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Decades of combined multidisciplinary leadership across agriculture, architecture, and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {team.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 space-y-4 hover:shadow-lg transition group">
              <div className="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={m.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {m.department}
                </div>
                <h3 className="font-bold text-base text-slate-900">{m.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{m.role}</p>
                {m.bio && <p className="text-xs text-slate-600 line-clamp-3 pt-1">{m.bio}</p>}
              </div>

              {m.skills && (
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {((m.skills as string[]) || []).map((sk) => (
                    <span key={sk} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

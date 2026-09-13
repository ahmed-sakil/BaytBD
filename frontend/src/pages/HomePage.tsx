import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Building2,
  Cpu,
  ArrowRight,
  Award,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Sparkles,
  ShieldCheck,
  Server,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { agroApi, devApi, itApi } from '../services/api';
import { Product, DevelopmentProject, ITService } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const HomePage: React.FC = () => {
  const { t, formatNumber, formatCurrency } = useLanguage();
  usePageTitle(t('nav.home'));
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<DevelopmentProject[]>([]);
  const [services, setServices] = useState<ITService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, projRes, itRes] = await Promise.all([
          agroApi.getProducts({ featured: 'true' }),
          devApi.getProjects({ featured: 'true' }),
          itApi.getServices(),
        ]);
        if (prodRes.success) setFeaturedProducts((prodRes.products || []).slice(0, 3));
        if (projRes.success) setFeaturedProjects((projRes.projects || []).slice(0, 3));
        if (itRes.success) setServices((itRes.services || []).slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-20 pb-28 sm:pb-36 px-4 sm:px-8 border-b border-slate-900">
        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold tracking-wider uppercase shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('home.heroPill')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            {t('home.heroTitle')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('home.heroSub')}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#divisions"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-2"
            >
              <span>{t('home.explorePillars')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/contact?dept=PARTNERSHIP"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-2"
            >
              <span>{t('nav.partner')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE BENCHMARK METRICS (PROFESSIONAL NUMBER RIBBON) */}
      <section className="-mt-12 sm:-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Metric 1 */}
            <div className="p-6 sm:p-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  {t('common.established')}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">{formatNumber(18)}+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Years</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('home.stat1')}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('home.stat1Desc')}
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-6 sm:p-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest font-mono">
                  {t('nav.agro')}
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">{formatNumber(12000)}+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Acres</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('home.stat2')}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('home.stat2Desc')}
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-6 sm:p-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest font-mono">
                  {t('nav.development')}
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">{formatNumber('1.8M')}+</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sq. Ft.</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('home.stat3')}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('home.stat3Desc')}
                </p>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-6 sm:p-8 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest font-mono">
                  {t('nav.it')}
                </span>
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">{formatNumber('99.99')}%</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">{t('home.stat4')}</div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {t('home.stat4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS GATEWAY / TRI-SECTOR OVERVIEW */}
      <section id="divisions" className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            <Layers className="w-3.5 h-3.5 text-slate-700" />
            <span>{t('home.pillarsBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('home.pillarsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {t('home.pillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Agro */}
          <Link
            to="/agro"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600/40 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                  <Sprout className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                  {t('nav.agro')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {t('nav.agro')}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {t('home.agroDesc')}
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>{t('home.agroCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Development */}
          <Link
            to="/development"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-600/40 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                  {t('nav.development')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                  {t('nav.development')}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {t('home.devDesc')}
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>{t('home.devCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: IT */}
          <Link
            to="/it"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-600/40 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-mono">
                  {t('nav.it')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                  {t('nav.it')}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {t('home.itDesc')}
                </p>
              </div>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>{t('home.itCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. BAYT AGRO SECTION (DISTINCT EMERALD-TINTED BAND) */}
      <section className="bg-slate-50/70 border-t border-b border-slate-200/80 py-16 sm:py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('home.agroSectionBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {t('home.agroSectionTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {t('home.agroSectionSub')}
              </p>
            </div>
            <Link
              to="/agro"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              <span>{t('home.viewFullAgro')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => {
              const price = product.discountPrice ?? product.price;
              const img = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {product.discountPrice && (
                        <span className="absolute top-3 left-3 bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                          Save {formatCurrency(product.price - product.discountPrice)}
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {product.category?.name || 'Organic'}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <Link to={`/agro/products/${product.slug}`}>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <div>
                      <div className="text-base font-black text-slate-900 font-mono">{formatCurrency(price)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">per {product.unit}</div>
                    </div>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('common.addToCart')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BAYT DEVELOPMENT SECTION (CRISP WHITE ARCHITECTURAL ZONE) */}
      <section className="bg-white py-16 sm:py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('home.devSectionBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {t('home.devSectionTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {t('home.devSectionSub')}
              </p>
            </div>
            <Link
              to="/development"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              <span>{t('home.viewFullDev')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/40 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={project.featuredImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-3 left-3 flex space-x-1.5">
                      <span className="bg-slate-900/90 backdrop-blur text-amber-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                        {project.status}
                      </span>
                      <span className="bg-white/95 backdrop-blur text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                        {project.projectType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center text-[11px] text-slate-500 space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span className="truncate">{project.location}, {project.city}</span>
                    </div>
                    <Link to={`/development/projects/${project.slug}`}>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition line-clamp-1">
                        {project.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mt-2">
                  <div className="text-[11px]">
                    <span className="font-semibold text-slate-900">{project.numberOfFloors || 'High-rise'}</span>
                    <span className="text-slate-400"> • {project.units || 'Exclusive units'}</span>
                  </div>
                  <Link
                    to={`/development/projects/${project.slug}`}
                    className="font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                  >
                    <span>{t('common.details')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BAYT IT SECTION (DISTINCT SLATE TECH BAND) */}
      <section className="bg-slate-50/70 border-t border-b border-slate-200/80 py-16 sm:py-24 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                <Cpu className="w-3.5 h-3.5 text-sky-700" />
                <span>{t('home.itSectionBadge')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {t('home.itSectionTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {t('home.itSectionSub')}
              </p>
            </div>
            <Link
              to="/it"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-sky-800 hover:text-sky-900 bg-white border border-slate-200 px-4 py-2 rounded-xl transition shadow-xs whitespace-nowrap"
            >
              <span>{t('home.viewFullIt')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {service.technologies && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {((service.technologies as string[]) || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-slate-100 mt-5 flex justify-between items-center text-xs font-semibold text-sky-700">
                  <Link to="/it#capabilities" className="flex items-center space-x-1 hover:underline">
                    <span>{t('home.techCapabilities')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PARTNERSHIP & CONTACT CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 w-full">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Award className="w-4 h-4 text-slate-400" />
              <span>{t('home.ctaBadge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.ctaSub')}
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to="/contact?dept=PARTNERSHIP"
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold shadow-xs transition"
              >
                {t('home.ctaBtn')}
              </Link>
              <Link
                to="/about"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
              >
                {t('about.leadershipTitle')}
              </Link>
              <Link
                to="/privacy"
                className="px-5 py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-400 border border-slate-700/60 rounded-xl text-xs font-semibold transition"
              >
                {t('common.privacyPolicy')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

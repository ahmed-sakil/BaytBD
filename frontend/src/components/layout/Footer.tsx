import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Sprout,
  Building2,
  Cpu,
} from 'lucide-react';
import { useCompany } from '../../context/CompanyContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { companyInfo } = useCompany();
  const { t, formatNumber } = useLanguage();

  const companyName = companyInfo?.companyName || 'BAYT GROUP';
  const tagline = companyInfo?.tagline || t('footer.tagline');
  const address = companyInfo?.address || 'Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh';
  const phone = companyInfo?.primaryPhone || '+880 1800-BAYTBD';
  const email = companyInfo?.primaryEmail || 'info@baytbd.com';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Group Showcase */}
      <div className="border-b border-slate-800/80 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Agro Mini Banner */}
          <Link
            to="/agro"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
                <Sprout className="w-5 h-5" />
                <span>Bayt Agro</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pioneering ethical organic farming, cold-pressed oils, natural honey, and certified bio-agricultural inputs across Bangladesh.
            </p>
          </Link>

          {/* Development Mini Banner */}
          <Link
            to="/development"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
                <Building2 className="w-5 h-5" />
                <span>Bayt Development</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curating architectural landmarks, LEED certified commercial high-rises, and ultra-luxury residential sanctuaries in prime metropolitan zones.
            </p>
          </Link>

          {/* IT Mini Banner */}
          <Link
            to="/it"
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-sky-950/20 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-sky-400 font-bold text-base">
                <Cpu className="w-5 h-5" />
                <span>Bayt IT</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineering mission-critical enterprise software, cloud infrastructure, AI automation, and sub-100ms transactional platforms.
            </p>
          </Link>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            {companyInfo?.iconUrl ? (
              <img
                src={companyInfo.iconUrl}
                alt={companyName}
                className="w-9 h-9 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center font-black text-lg tracking-tighter">
                {companyName.charAt(0) || 'B'}
              </div>
            )}
            <div>
              <div className="text-lg font-extrabold tracking-tight text-white leading-none">
                {companyName}
              </div>
              <div className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
                {tagline}
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {companyInfo?.description ||
              companyInfo?.tagline ||
              'One Group. Three Businesses. One Digital Ecosystem. Building national infrastructure in ethical agriculture, premier real estate, and enterprise software.'}
          </p>

          {/* Branded Social Media Icons */}
          <div className="flex items-center space-x-2.5 pt-1">
            {companyInfo?.facebookUrl && (
              <a
                href={companyInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}

            {companyInfo?.linkedinUrl && (
              <a
                href={companyInfo.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-700 hover:border-sky-600 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.76-.79 1.76-1.76s-.79-1.76-1.76-1.76a1.76 1.76 0 0 0 0 3.52m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>
            )}

            {companyInfo?.twitterUrl && (
              <a
                href={companyInfo.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="X (formerly Twitter)"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}

            {companyInfo?.instagramUrl && (
              <a
                href={companyInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}

            {companyInfo?.youtubeUrl && (
              <a
                href={companyInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 hover:border-red-500 transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Corporate Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.corporate')}</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/about" className="hover:text-white transition">{t('nav.about')}</Link></li>
            <li><Link to="/about#leadership" className="hover:text-white transition">{t('about.leadershipTitle')}</Link></li>
            <li><Link to="/news" className="hover:text-white transition">{t('nav.news')}</Link></li>
            <li><Link to="/careers" className="hover:text-white transition">{t('nav.careers')}</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">{t('nav.partner')}</Link></li>
          </ul>
        </div>

        {/* Verticals Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.businesses')}</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/agro" className="hover:text-emerald-400 transition">{t('nav.agro')}</Link></li>
            <li><Link to="/development" className="hover:text-amber-400 transition">{t('nav.development')}</Link></li>
            <li><Link to="/it" className="hover:text-sky-400 transition">{t('nav.it')}</Link></li>
            <li><Link to="/agro/checkout" className="hover:text-white transition">{t('common.cart')}</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition">{t('nav.adminPortal')}</Link></li>
          </ul>
        </div>

        {/* Headquarters Contact */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t('footer.headquarters')}</h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a href={`tel:${phone}`} className="font-mono hover:text-white transition">
                {phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white transition">
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-8 bg-black/40 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {formatNumber(new Date().getFullYear())} {companyName}. {t('footer.allRightsReserved')}
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-slate-300 transition">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-slate-300 transition">{t('footer.termsOfService')}</Link>
            <Link to="/about" className="hover:text-slate-300 transition">{t('footer.corporateDisclosures')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

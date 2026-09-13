import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  Building2,
  Cpu,
  ShoppingBag,
  Menu,
  X,
  Phone,
  ChevronDown,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { totalItems, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { companyInfo } = useCompany();
  const { t, isBangla } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);

  const companyName = companyInfo?.companyName || 'BAYTBD';
  const phone = companyInfo?.primaryPhone || '+880 1800-BAYTBD';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isVertical = location.pathname.startsWith('/agro')
    ? 'agro'
    : location.pathname.startsWith('/development')
    ? 'development'
    : location.pathname.startsWith('/it')
    ? 'it'
    : 'corporate';

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-slate-100 theme-transition">
      {/* 1. TOP PORTAL SWITCHER BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-slate-400 text-[11px] hidden md:inline uppercase tracking-wider font-semibold">
              {t('nav.portals')}
            </span>
            <Link
              to="/"
              onClick={() => setTheme('corporate')}
              className={`px-2.5 py-1 rounded-md text-xs transition flex items-center space-x-1.5 ${
                isVertical === 'corporate'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>{t('nav.group')}</span>
            </Link>
            <Link
              to="/agro"
              onClick={() => setTheme('agro')}
              className={`px-2.5 py-1 rounded-md text-xs transition flex items-center space-x-1.5 ${
                isVertical === 'agro'
                  ? 'bg-emerald-900/80 text-emerald-300 font-semibold border border-emerald-700/50 shadow-xs'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
              }`}
            >
              <Sprout className="w-3 h-3" />
              <span>{t('nav.agro')}</span>
            </Link>
            <Link
              to="/development"
              onClick={() => setTheme('development')}
              className={`px-2.5 py-1 rounded-md text-xs transition flex items-center space-x-1.5 ${
                isVertical === 'development'
                  ? 'bg-amber-950/90 text-amber-300 font-semibold border border-amber-700/50 shadow-xs'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>{t('nav.development')}</span>
            </Link>
            <Link
              to="/it"
              onClick={() => setTheme('it')}
              className={`px-2.5 py-1 rounded-md text-xs transition flex items-center space-x-1.5 ${
                isVertical === 'it'
                  ? 'bg-sky-950/90 text-sky-300 font-semibold border border-sky-700/50 shadow-xs'
                  : 'text-slate-400 hover:text-sky-300 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>{t('nav.it')}</span>
            </Link>
          </div>

          {/* Quick Hotline, Admin Portal & Language Switcher */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden lg:flex items-center space-x-3 text-xs">
              <a
                href={`tel:${phone}`}
                className="flex items-center space-x-1 hover:text-white transition font-mono"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{phone}</span>
              </a>
              <span className="text-slate-700">|</span>
              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('common.adminPortal')} ({user.name.split(' ')[0]})</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="text-slate-400 hover:text-white transition flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{t('common.staffPortal')}</span>
                </Link>
              )}
              <span className="text-slate-700">|</span>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-3 group">
          {companyInfo?.iconUrl ? (
            <img
              src={companyInfo.iconUrl}
              alt={companyName}
              className="w-10 h-10 rounded-xl object-contain bg-slate-900 border border-slate-800 p-1 shadow-md group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-md group-hover:scale-105 transition">
              {companyName.charAt(0) || 'B'}<span className="text-emerald-400">D</span>
            </div>
          )}
          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              {companyName}
            </div>
            <div className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
              {companyInfo?.tagline ? 'Conglomerate' : 'Group of Companies'}
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium text-slate-600">
          <Link
            to="/"
            className={`transition hover:text-slate-900 ${
              isActive('/') ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/about"
            className={`transition hover:text-slate-900 ${
              isActive('/about') ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {t('nav.about')}
          </Link>

          {/* Businesses Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBizDropdownOpen(true)}
            onMouseLeave={() => setBizDropdownOpen(false)}
          >
            <button
              onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
              className={`flex items-center space-x-1 py-1 transition hover:text-slate-900 ${
                isActive('/agro') || isActive('/development') || isActive('/it')
                  ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5'
                  : ''
              }`}
            >
              <span>{t('nav.businesses')}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${bizDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {bizDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  to="/agro"
                  onClick={() => {
                    setTheme('agro');
                    setBizDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{t('nav.agro')}</div>
                    <div className="text-[11px] text-slate-500">Organic produce & supplies</div>
                  </div>
                </Link>
                <Link
                  to="/development"
                  onClick={() => {
                    setTheme('development');
                    setBizDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-800 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{t('nav.development')}</div>
                    <div className="text-[11px] text-slate-500">Commercial & luxury living</div>
                  </div>
                </Link>
                <Link
                  to="/it"
                  onClick={() => {
                    setTheme('it');
                    setBizDropdownOpen(false);
                  }}
                  className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-sky-50 text-slate-800 hover:text-sky-800 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900">{t('nav.it')}</div>
                    <div className="text-[11px] text-slate-500">Software & cloud engineering</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/news"
            className={`transition hover:text-slate-900 ${
              isActive('/news') ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {t('nav.news')}
          </Link>
          <Link
            to="/careers"
            className={`transition hover:text-slate-900 ${
              isActive('/careers') ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {t('nav.careers')}
          </Link>
          <Link
            to="/contact"
            className={`transition hover:text-slate-900 ${
              isActive('/contact') ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
            }`}
          >
            {t('nav.contact')}
          </Link>
        </nav>

        {/* RIGHT ACTIONS: Cart Button + Quick Inquiry CTA */}
        <div className="flex items-center space-x-3">
          {/* Cart Icon (with badge) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
            title="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            to="/contact?dept=PARTNERSHIP"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide transition shadow-xs"
          >
            {t('nav.partner')}
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. CONTEXTUAL VERTICAL SUB-NAV (Dynamic based on active vertical) */}
      {isVertical !== 'corporate' && (
        <div
          className={`border-t text-xs font-medium py-2 px-4 sm:px-8 theme-transition ${
            isVertical === 'agro'
              ? 'bg-emerald-50/80 border-emerald-100 text-emerald-950'
              : isVertical === 'development'
              ? 'bg-amber-50/80 border-amber-100 text-amber-950'
              : 'bg-sky-50/80 border-sky-100 text-sky-950'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold uppercase tracking-wider flex items-center space-x-1">
                {isVertical === 'agro' && (
                  <>
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-800 font-bold">Bayt Agro:</span>
                  </>
                )}
                {isVertical === 'development' && (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-amber-800 font-bold">Bayt Development:</span>
                  </>
                )}
                {isVertical === 'it' && (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-sky-600" />
                    <span className="text-sky-800 font-bold">Bayt IT:</span>
                  </>
                )}
              </span>
              <span className="text-slate-400">/</span>
              {isVertical === 'agro' && (
                <div className="flex space-x-4">
                  <Link to="/agro" className="hover:underline font-semibold">
                    All Products
                  </Link>
                  <Link to="/agro?category=organic-grains-pulses" className="hover:underline text-slate-600">
                    Organic Grains
                  </Link>
                  <Link to="/agro?category=dairy-fresh" className="hover:underline text-slate-600">
                    Dairy & Honey
                  </Link>
                  <Link to="/agro?category=agro-inputs-fertilizer" className="hover:underline text-slate-600">
                    Bio-Fertilizers
                  </Link>
                </div>
              )}
              {isVertical === 'development' && (
                <div className="flex space-x-4">
                  <Link to="/development" className="hover:underline font-semibold">
                    All Projects
                  </Link>
                  <Link to="/development?status=ONGOING" className="hover:underline text-slate-600">
                    Ongoing
                  </Link>
                  <Link to="/development?status=COMPLETED" className="hover:underline text-slate-600">
                    Completed
                  </Link>
                  <Link to="/development?status=UPCOMING" className="hover:underline text-slate-600">
                    Upcoming
                  </Link>
                </div>
              )}
              {isVertical === 'it' && (
                <div className="flex space-x-4">
                  <a
                    href="#capabilities"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('capabilities');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline font-semibold cursor-pointer"
                  >
                    Capabilities
                  </a>
                  <a
                    href="#case-studies"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('case-studies');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Case Studies
                  </a>
                  <a
                    href="#consultation"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('consultation');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:underline text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Consultation
                  </a>
                </div>
              )}
            </div>

            <div className="hidden sm:block text-slate-500 text-[11px]">
              {isVertical === 'agro' && 'Delivery Across Bangladesh • BSTI Certified'}
              {isVertical === 'development' && 'Civil Engineering Compliant • Landmark Developments'}
              {isVertical === 'it' && 'Sub-100ms Enterprise Architecture • ISO 27001'}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION OVERLAY MODAL DRAWER (Does not push content down, with smooth appear & disappear animation) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop Blur Overlay */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer Modal Content */}
        <div
          className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-300 ease-out transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
            <div className="space-y-6">
              {/* Header inside modal */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  {companyInfo?.iconUrl ? (
                    <img
                      src={companyInfo.iconUrl}
                      alt={companyName}
                      className="w-8 h-8 rounded-lg object-contain bg-slate-900 border border-slate-800 p-1"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                      {companyName.charAt(0) || 'B'}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-extrabold text-slate-900 leading-none">{companyName}</div>
                    <div className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                      {companyInfo?.tagline ? 'Conglomerate' : 'Group of Companies'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <LanguageSwitcher />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Links with Divider Lines */}
              <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50 shadow-2xs">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-3 text-sm font-semibold text-slate-800 hover:bg-white hover:text-slate-950 transition min-h-[44px]"
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3.5 py-3 text-sm font-semibold text-slate-800 hover:bg-white hover:text-slate-950 transition min-h-[44px]"
                >
                  {t('nav.about')}
                </Link>
              </div>

              {/* Verticals Section with Divider Lines */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  {t('nav.businesses')}
                </div>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50 shadow-2xs">
                  <Link
                    to="/agro"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-3 hover:bg-white text-slate-800 hover:text-emerald-700 transition min-h-[44px]"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{t('nav.agro')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Organic produce & cold-pressed oils</div>
                    </div>
                  </Link>
                  <Link
                    to="/development"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-3 hover:bg-white text-slate-800 hover:text-amber-700 transition min-h-[44px]"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{t('nav.development')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Commercial high-rises & luxury suites</div>
                    </div>
                  </Link>
                  <Link
                    to="/it"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-3 hover:bg-white text-slate-800 hover:text-sky-700 transition min-h-[44px]"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{t('nav.it')}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Enterprise systems & AI platforms</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Shared Pages with Divider Lines */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  {t('footer.corporate')}
                </div>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50 shadow-2xs text-xs font-medium text-slate-700">
                  <Link
                    to="/news"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3.5 py-3 hover:bg-white hover:text-slate-900 transition min-h-[44px]"
                  >
                    {t('nav.news')}
                  </Link>
                  <Link
                    to="/careers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3.5 py-3 hover:bg-white hover:text-slate-900 transition min-h-[44px]"
                  >
                    {t('nav.careers')}
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3.5 py-3 hover:bg-white hover:text-slate-900 transition min-h-[44px]"
                  >
                    {t('nav.contact')}
                  </Link>
                </div>
              </div>

              {/* Direct Hotline */}
              <div>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center space-x-2 px-3.5 py-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition min-h-[44px]"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono">{phone}</span>
                </a>
              </div>
            </div>

            {/* Bottom staff link */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition shadow-xs min-h-[44px]"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('nav.adminPortal')}</span>
              </Link>
            </div>
          </div>
        </div>
    </header>
  );
};

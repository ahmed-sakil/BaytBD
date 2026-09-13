import React from 'react';
import { FileText, ShieldCheck, Scale, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('common.termsOfService'));
  return (
    <div className="space-y-12 sm:space-y-16 pb-20 sm:pb-24">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 px-4 sm:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>COMMERCIAL & LEGAL GOVERNANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Effective Date: January 1, 2026 • BaytBD Group of Companies
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Intro */}
        <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-800" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            Welcome to BaytBD Group (&quot;BaytBD&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing, browsing, or utilizing any services provided across our group digital platforms—including Bayt Agro e-commerce, Bayt Development real estate portfolio, and Bayt IT enterprise solutions—you agree to be bound by these Terms of Service.
          </p>
          <p>
            If you do not agree with any portion of these terms, you should discontinue using our website and services immediately.
          </p>
        </div>

        {/* Vertical Conditions */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <span>2. Business Vertical Specific Terms</span>
          </h2>

          <div className="space-y-3">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-emerald-700">
                A. Bayt Agro Commercial Conditions
              </h3>
              <p className="text-slate-600 text-xs">
                All agricultural commodities, cold-pressed oils, natural honey, and organic goods offered are subject to real-time batch availability. While we make every effort to display accurate pricing in Bangladeshi Taka (BDT), BaytBD reserves the right to adjust product prices or cancel orders in cases of obvious typographical errors or verified stock shortages. Payments via Cash on Delivery (COD), bKash, or Nagad must be settled as agreed upon order confirmation.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-amber-700">
                B. Bayt Development Property Disclosures
              </h3>
              <p className="text-slate-600 text-xs">
                Architectural renderings, floor plans, specifications, and project completion dates displayed on the site are representational and intended for informational orientation. Formal property acquisition, deed transfers, and financial terms are governed solely by bilateral legal deeds and RAJUK-compliant contracts executed directly with Bayt Development executives.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-sky-700">
                C. Bayt IT Enterprise Engagements
              </h3>
              <p className="text-slate-600 text-xs">
                Service specifications and technology stack descriptions represent our core engineering capabilities. Enterprise consulting agreements, deliverables, SLAs, intellectual property ownership, and liability limitations are formalized in customized Master Services Agreements (MSAs) and Statements of Work (SOWs).
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Intellectual Property Rights</h2>
          <p>
            All trademarks, logos, texts, architectural renders, software architectures, graphics, and interface designs on this website are the proprietary property of BaytBD Group of Companies and are protected by applicable intellectual property copyright and trademark laws.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-slate-800" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p>
            In no event shall BaytBD Group or its directors, employees, or affiliates be liable for any indirect, incidental, consequential, or punitive damages arising from your access to or inability to access our digital platforms.
          </p>
        </div>

        {/* Governing Law */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Governing Law & Jurisdiction</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Dhaka, Bangladesh.
          </p>
        </div>

        {/* Contact Info */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">6. Legal Correspondence</h2>
          <p className="text-xs text-slate-600">
            For inquiries regarding corporate contracts, commercial partnerships, or terms compliance:
          </p>
          <div className="space-y-1.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email: legal@baytbd.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Direct: +880 2 8878901</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh</span>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition"
            >
              <span>Contact Legal & Corporate Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;

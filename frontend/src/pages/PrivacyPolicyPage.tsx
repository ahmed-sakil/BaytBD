import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('common.privacyPolicy'));
  return (
    <div className="space-y-12 sm:space-y-16 pb-20 sm:pb-24">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 px-4 sm:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>LEGAL & CORPORATE COMPLIANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Effective Date: January 1, 2026 • BaytBD Group of Companies
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* Intro Card */}
        <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-800" />
            <span>1. Commitment to Data Protection</span>
          </h2>
          <p>
            BaytBD Group of Companies (&quot;BaytBD&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), including our business verticals—Bayt Agro, Bayt Development, and Bayt IT—is committed to protecting the privacy and personal data of our customers, clients, partners, and website visitors.
          </p>
          <p>
            This Privacy Policy outlines the types of personal data we collect, how it is processed and secured, and the rights available to you under applicable data protection regulations and the laws of Bangladesh.
          </p>
        </div>

        {/* Scope */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Eye className="w-4 h-4 text-slate-800" />
            <span>2. Scope of Information Collected</span>
          </h2>
          <p>We may collect personal information across our platforms in the following contexts:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>E-Commerce & Orders (Bayt Agro):</strong> Full name, delivery shipping address, phone number, email address, payment verification notes, and order history.
            </li>
            <li>
              <strong>Real Estate & Property Inquiries (Bayt Development):</strong> Full name, contact phone, email, preferred property units, site visit schedule preferences, and financing criteria.
            </li>
            <li>
              <strong>Enterprise Solutions & Consultations (Bayt IT):</strong> Corporate organization, official business email, company size, project architectural requirements, and technical service requests.
            </li>
            <li>
              <strong>Institutional & Strategic Partnerships:</strong> Business proposals, authorized executive contact details, and partnership objectives.
            </li>
            <li>
              <strong>Careers & Employment:</strong> Resumes, employment history, qualifications, and cover letters submitted through our careers portal.
            </li>
          </ul>
        </div>

        {/* Purpose */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>3. How We Use Your Information</span>
          </h2>
          <p>The information collected is used exclusively for legitimate business purposes:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-semibold text-slate-900 text-xs">Order Fulfillment & Logistics</div>
              <p className="text-[11px] text-slate-500">Processing agro orders, coordinating courier dispatch, and generating printable invoice receipts.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-semibold text-slate-900 text-xs">Consultation & Site Visits</div>
              <p className="text-[11px] text-slate-500">Facilitating real estate inspections, architectural consultations, and enterprise technical discovery.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-semibold text-slate-900 text-xs">Communication & Support</div>
              <p className="text-[11px] text-slate-500">Responding directly to client queries, order status updates, and strategic collaboration proposals.</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-semibold text-slate-900 text-xs">Security & Regulatory Compliance</div>
              <p className="text-[11px] text-slate-500">Preventing fraudulent transactions, ensuring role-based data security, and complying with statutory laws.</p>
            </div>
          </div>
        </div>

        {/* Data Protection & Storage */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-slate-800" />
            <span>4. Data Security & Storage Architecture</span>
          </h2>
          <p>
            BaytBD Group implements industry-standard technical and organizational security safeguards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Encryption:</strong> All transmissions between your browser and our servers are encrypted using modern Transport Layer Security (TLS/SSL).</li>
            <li><strong>Access Control:</strong> Administrative data access is governed by strict Role-Based Access Control (RBAC). Only authorized staff may view client inquiries or order records.</li>
            <li><strong>Cloud Asset Protection:</strong> Media uploads and architectural documents are protected via secure Cloudinary storage with signed identifiers.</li>
            <li><strong>No Data Brokering:</strong> We do not sell, rent, or trade your personal data to any external marketing agencies or third parties.</li>
          </ul>
        </div>

        {/* Third-Party Providers */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Third-Party Service Providers</h2>
          <p>
            We may engage trusted third-party providers for payment verification (bKash, Nagad, bank transfers), cloud infrastructure hosting, and logistics courier partners. These providers only receive the minimal necessary data to fulfill their assigned service obligations.
          </p>
        </div>

        {/* Your Rights */}
        <div className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Your Rights & Data Choices</h2>
          <p>
            You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or request deletion of your account and inquiry data, subject to legal and accounting retention requirements.
          </p>
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">7. Data Protection Officer Contact</h2>
          <p className="text-xs text-slate-600">
            If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact our corporate compliance office:
          </p>
          <div className="space-y-1.5 text-xs text-slate-700 font-medium">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>Email: compliance@baytbd.com / privacy@baytbd.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Hotline: +880 1800-BAYTBD</span>
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
              <span>Contact Compliance Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, CheckCircle2, MessageSquare, Clock, Handshake } from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../services/api';
import { useCompany } from '../context/CompanyContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.contact'));
  const { companyInfo } = useCompany();
  const [searchParams] = useSearchParams();
  const requestedDept = searchParams.get('dept');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    departmentTarget: requestedDept || 'CORPORATE',
    subject: requestedDept === 'PARTNERSHIP' ? 'Strategic Partnership Proposal' : '',
    message: '',
  });

  useEffect(() => {
    if (requestedDept) {
      setFormData((prev) => ({
        ...prev,
        departmentTarget: requestedDept,
        subject: requestedDept === 'PARTNERSHIP' && !prev.subject ? 'Strategic Partnership Proposal' : prev.subject,
      }));
    }
  }, [requestedDept]);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
        departmentTarget: formData.departmentTarget,
        subject:
          formData.subject.trim() ||
          (formData.departmentTarget === 'PARTNERSHIP'
            ? 'Strategic Partnership Proposal'
            : formData.departmentTarget === 'IT'
            ? 'IT Technical Consultation'
            : 'General Business Inquiry'),
        message: formData.message.trim(),
      };
      const res = await cmsApi.submitGeneralInquiry(payload);
      if (res.success) {
        toast.success('Inquiry Submitted Successfully!', {
          description: 'Thank you for reaching out. A BaytBD representative will contact you shortly.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          departmentTarget: requestedDept || 'CORPORATE',
          subject: requestedDept === 'PARTNERSHIP' ? 'Strategic Partnership Proposal' : '',
          message: '',
        });
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Error submitting message. Please verify your details.';
      toast.error('Submission Failed', {
        description: msg,
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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold tracking-wider uppercase shadow-inner">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('contact.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            {t('contact.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('contact.heroSub')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Contact Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <MapPin className="w-5 h-5 text-sky-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{t('contact.hq')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {companyInfo?.address || 'Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh'}
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{t('contact.lines')}</h3>
              <div className="text-xs text-slate-600 space-y-1 font-mono">
                <div>Group Primary: {companyInfo?.primaryPhone || '+880 1800-BAYTBD'}</div>
                {companyInfo?.secondaryPhone && <div>Secondary Line: {companyInfo.secondaryPhone}</div>}
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-700 text-white flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{t('contact.emailCard')}</h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Primary: {companyInfo?.primaryEmail || 'info@baytbd.com'}</div>
                {companyInfo?.supportEmail && <div>Inquiries: {companyInfo.supportEmail}</div>}
                <div>Bayt Agro: agro@baytbd.com</div>
                <div>Bayt Development: development@baytbd.com</div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">{t('contact.formTitle')}</h3>
              <p className="text-xs text-slate-500">{t('contact.formSub')}</p>
            </div>

          {formData.departmentTarget === 'PARTNERSHIP' && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 flex items-center space-x-2 text-xs">
              <Handshake className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>{t('contact.partnershipChannel')}</strong> {t('contact.partnershipNotice')}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahfuzur Rahman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.email')}</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.phone')}</label>
                <input
                  type="tel"
                  placeholder="017xxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.company')}</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Ltd."
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.targetDept')}</label>
                <select
                  value={formData.departmentTarget}
                  onChange={(e) => setFormData({ ...formData, departmentTarget: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
                >
                  <option value="CORPORATE">{t('contact.deptGeneral')}</option>
                  <option value="AGRO">{t('contact.deptAgro')}</option>
                  <option value="DEVELOPMENT">{t('contact.deptDev')}</option>
                  <option value="IT">{t('contact.deptIT')}</option>
                  <option value="PARTNERSHIP">{t('contact.deptPartner')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.subject')}</label>
                <input
                  type="text"
                  placeholder="e.g. Partnership Proposal / Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 h-11 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">{t('contact.message')}</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed information regarding your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[48px] py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? t('contact.submitting') : t('contact.submitInquiry')}</span>
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

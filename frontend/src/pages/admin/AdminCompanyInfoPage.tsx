import React, { useState, useEffect } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Share2,
  Save,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../../services/api';
import { useCompany } from '../../context/CompanyContext';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminCompanyInfoPage: React.FC = () => {
  const { companyInfo, refreshCompany } = useCompany();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'social'>('general');

  const [formData, setFormData] = useState({
    companyName: 'BaytBD Group of Companies',
    tagline: 'One Group. Three Businesses. One Digital Ecosystem.',
    description: 'Building national infrastructure in ethical agriculture, premier real estate, and enterprise software.',
    logoUrl: '',
    iconUrl: '',
    primaryPhone: '+880 1800-BAYTBD',
    secondaryPhone: '+880 2 8878901',
    primaryEmail: 'info@baytbd.com',
    supportEmail: 'support@baytbd.com',
    address: 'Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh',
    city: 'Dhaka',
    country: 'Bangladesh',
    businessHours: 'Sun - Thu: 9:00 AM - 6:00 PM',
    facebookUrl: 'https://facebook.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
  });

  useEffect(() => {
    if (companyInfo) {
      setFormData({
        companyName: companyInfo.companyName || 'BaytBD Group of Companies',
        tagline: companyInfo.tagline || '',
        description: companyInfo.description || '',
        logoUrl: companyInfo.logoUrl || '',
        iconUrl: companyInfo.iconUrl || '',
        primaryPhone: companyInfo.primaryPhone || '',
        secondaryPhone: companyInfo.secondaryPhone || '',
        primaryEmail: companyInfo.primaryEmail || '',
        supportEmail: companyInfo.supportEmail || '',
        address: companyInfo.address || '',
        city: companyInfo.city || 'Dhaka',
        country: companyInfo.country || 'Bangladesh',
        businessHours: companyInfo.businessHours || 'Sun - Thu: 9:00 AM - 6:00 PM',
        facebookUrl: companyInfo.facebookUrl || '',
        linkedinUrl: companyInfo.linkedinUrl || '',
        twitterUrl: companyInfo.twitterUrl || '',
        instagramUrl: companyInfo.instagramUrl || '',
        youtubeUrl: companyInfo.youtubeUrl || '',
      });
    }
  }, [companyInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await cmsApi.updateCompanyInfo(formData);
      if (res.success) {
        toast.success('Company information updated', {
          description: 'Global corporate details have been refreshed across the public portal.',
        });
        await refreshCompany();
      }
    } catch (err: any) {
      toast.error('Failed to update company info', {
        description: err.response?.data?.message || 'Check your permissions and connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-sm">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Company & Brand Profile
              </h1>
              <p className="text-sm text-slate-500">
                Manage corporate identity, headquarters, contact channels, and social presence across the public portal.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refreshCompany()}
            className="px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            Reload
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60 transition-all flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Save className="w-4 h-4 text-emerald-400" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'general'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          General & Visuals
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'contacts'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Phone className="w-4 h-4" />
          Contacts & Address
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'social'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Social Networks
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* TAB 1: GENERAL & VISUALS */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-semibold text-slate-900">Brand Identity</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official corporate name, public tagline, and summary description.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. BaytBD Group of Companies"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Corporate Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="e.g. One Group. Three Businesses. One Digital Ecosystem."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Description / Executive Summary
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Short description of the conglomerate and core business segments..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">Used in meta descriptions and footer summary text.</p>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-5">
                  <h3 className="text-sm font-semibold text-slate-900">Brand Assets & Logos</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ImageUpload
                        label="Primary Brand Logo"
                        helperText="Used on public navbar and official documents (PNG, SVG, WebP recommended)"
                        value={formData.logoUrl}
                        onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <ImageUpload
                        label="Brand Icon / Favicon"
                        helperText="Square emblem or favicon used on mobile icons and headers"
                        value={formData.iconUrl}
                        onChange={(url) => setFormData({ ...formData, iconUrl: url })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTACTS & ADDRESS */}
            {activeTab === 'contacts' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-semibold text-slate-900">Direct Contact Channels</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Phone numbers and email addresses displayed in the header, footer, and contact page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Primary Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.primaryPhone}
                      onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                      placeholder="+880 1800-BAYTBD"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Secondary Phone
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryPhone}
                      onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                      placeholder="+880 2 8878901"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Primary Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.primaryEmail}
                      onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                      placeholder="info@baytbd.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Support / Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={formData.supportEmail}
                      onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                      placeholder="support@baytbd.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Headquarters & Office Hours</h3>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Office Address *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Bayt Tower, Level 14, Road 71, Gulshan-2, Dhaka-1212, Bangladesh"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Dhaka"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Bangladesh"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        value={formData.businessHours}
                        onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                        placeholder="Sun - Thu: 9:00 AM - 6:00 PM"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL NETWORKS */}
            {activeTab === 'social' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-base font-semibold text-slate-900">Social Media & Channels</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official channels linked with authentic branded icons across the website footer and contact points.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={formData.facebookUrl}
                      onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                      placeholder="https://facebook.com/baytbd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      LinkedIn Page URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/company/baytbd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      X (Twitter) URL
                    </label>
                    <input
                      type="url"
                      value={formData.twitterUrl}
                      onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                      placeholder="https://x.com/baytbd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/baytbd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/@baytbd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Live Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-semibold text-slate-900">Live Brand Snapshot</h3>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl text-white space-y-3">
                <div className="flex items-center gap-3">
                  {formData.iconUrl ? (
                    <img
                      src={formData.iconUrl}
                      alt="Brand Icon"
                      className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1 border border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-base">
                      {formData.companyName.charAt(0) || 'B'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm tracking-wide text-white">
                      {formData.companyName || 'BaytBD Group'}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {formData.tagline || 'Building Sustainable Futures'}
                    </p>
                  </div>
                </div>

                {formData.logoUrl && (
                  <div className="bg-white/5 rounded-lg p-2 border border-white/10 flex items-center justify-center">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="max-h-12 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 pt-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{formData.address || 'Address not configured'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{formData.primaryPhone || 'Hotline not set'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.primaryEmail || 'Email not set'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{formData.businessHours || 'Hours not configured'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  SSL & Real-time Synced
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="text-xs font-semibold text-slate-900 hover:text-emerald-600 underline"
                >
                  Save now
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Where is this data used?
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Header & mobile menu phone hotline</li>
                <li>Footer addresses, emails, and brand details</li>
                <li>Footer social media direct buttons</li>
                <li>Contact & Partner with Us headquarters block</li>
                <li>System-generated PDF invoices and receipts</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sprout,
  Building2,
  Cpu,
  Inbox,
  Briefcase,
  Sliders,
  CheckCircle2,
  Copy,
  Info,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usePageTitle } from '../../utils/usePageTitle';

export const AdminLoginPage: React.FC = () => {
  usePageTitle('Admin Portal Login');
  const [email, setEmail] = useState('admin@baytbd.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillCredentials = () => {
    setEmail('admin@baytbd.com');
    setPassword('Admin@123456');
    toast.info('Pre-seeded credentials filled');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(`Welcome back, ${res.user.name}!`, {
          description: `Logged in as ${res.user.role}.`,
        });
        navigate('/admin/dashboard');
      } else {
        toast.error('Login Failed', { description: res.message });
      }
    } catch (err: any) {
      toast.error('Authentication Error', {
        description: err.response?.data?.message || 'Invalid credentials. Please verify your email and password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const guideModules = [
    {
      title: 'Bayt Agro Management',
      icon: Sprout,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Control organic and farm produce catalogs, adjust unit pricing and inventory stock levels, and verify incoming orders with Cash on Delivery or bKash/Nagad transaction IDs.',
    },
    {
      title: 'Bayt Development (Real Estate)',
      icon: Building2,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Curate residential and commercial property listings across Upcoming, Ongoing, and Completed phases. Manage floor plans, specs, and property buyer inquiries.',
    },
    {
      title: 'Bayt IT Solutions',
      icon: Cpu,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      description: 'Showcase enterprise technology services, modern tech stacks, client success stories, and manage technical discovery and consultation requests.',
    },
    {
      title: 'Inquiry & Lead Router',
      icon: Inbox,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Centralized communications hub partitioned by business vertical (Agro, Real Estate, IT, Strategic Partnership, Corporate) with real-time status tracking.',
    },
    {
      title: 'Dynamic Branding & Company Profile',
      icon: Sliders,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      description: 'Update official corporate addresses, phone numbers, contact emails, social channels, brand logo, and browser favicon across the entire portal in real time.',
    },
    {
      title: 'Corporate CMS & Careers',
      icon: Briefcase,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      description: 'Publish press releases, update executive leadership directory, announce career openings, and review incoming candidate applications.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">BaytBD Enterprise Administration</h1>
              <p className="text-xs sm:text-sm text-slate-500">Secure Operations, Governance & Digital Asset Management</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition hover:shadow"
          >
            <span>Return to Public Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sign-In Card (5 Cols on LG) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Staff Access Only</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sign In to Admin Panel</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your administrative credentials to manage corporate operations.</p>
            </div>

            {/* Pre-seeded Credentials Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Pre-seeded Admin Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillCredentials}
                  className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Fill</span>
                </button>
              </div>

              <div className="space-y-1 font-mono text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 select-none">Email:</span>
                  <span className="font-semibold text-slate-900 select-all">admin@baytbd.com</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 select-none">Password:</span>
                  <span className="font-semibold text-slate-900 select-all">Admin@123456</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Role: <span className="font-semibold text-slate-700">SUPER_ADMIN</span> (full read/write clearance across all modules).
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@baytbd.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-slate-900 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-md active:scale-95 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Security: JWT Bearer & RBAC</span>
              <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>API Gateway Online</span>
              </span>
            </div>
          </div>

          {/* Right Column: Platform Instructions & Architecture Guide (7 Cols on LG) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-2">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Administrative Operations Guide</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">How the BaytBD Admin Platform Works</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The BaytBD Admin Panel is a unified governance portal designed to give directors and department managers instant, real-time control over all three corporate verticals, customer orders, lead generation, and dynamic branding.
                </p>
              </div>

              {/* Module Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {guideModules.map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-sm transition group"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${mod.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {mod.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Operational Workflow Steps */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2.5">
                <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Key Workflow Highlights</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-slate-900 block">1. Dynamic Updates</span>
                    <p className="text-slate-600 text-[10px] leading-normal">Changes to company contact, favicon, logo, or catalog propagate immediately without redeployment.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-slate-900 block">2. Partitioned Inquiries</span>
                    <p className="text-slate-600 text-[10px] leading-normal">Public inquiries automatically tag their vertical (Agro, Development, IT) for departmental routing.</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-slate-900 block">3. Multi-currency & MFS</span>
                    <p className="text-slate-600 text-[10px] leading-normal">Track bKash, Nagad, and Cash on Delivery orders with customer details and dispatch workflow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


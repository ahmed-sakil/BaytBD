import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Building2,
  Mail,
  Cpu,
  Newspaper,
  Users,
  Briefcase,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Shield,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { usePageTitle } from '../../utils/usePageTitle';

interface NavGroup {
  groupName: string;
  items: {
    label: string;
    path: string;
    icon: React.FC<{ className?: string }>;
    roles?: string[];
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupName: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Messages & Inquiries',
        path: '/admin/inquiries',
        icon: Mail,
        roles: ['SUPER_ADMIN', 'ADMIN', 'BUSINESS_MANAGER', 'CONTENT_MANAGER', 'ORDER_MANAGER'],
      },
    ],
  },
  {
    groupName: 'Bayt Agro',
    items: [
      {
        label: 'Produce Catalog',
        path: '/admin/products',
        icon: Package,
        roles: ['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'],
      },
      {
        label: 'Customer Orders',
        path: '/admin/orders',
        icon: ShoppingBag,
        roles: ['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER'],
      },
    ],
  },
  {
    groupName: 'Bayt Development',
    items: [
      {
        label: 'Real Estate Projects',
        path: '/admin/projects',
        icon: Building2,
        roles: ['SUPER_ADMIN', 'ADMIN', 'BUSINESS_MANAGER'],
      },
    ],
  },
  {
    groupName: 'Bayt IT',
    items: [
      {
        label: 'Services & Portfolio',
        path: '/admin/it',
        icon: Cpu,
        roles: ['SUPER_ADMIN', 'ADMIN', 'BUSINESS_MANAGER'],
      },
    ],
  },
  {
    groupName: 'Corporate CMS',
    items: [
      {
        label: 'News & Press',
        path: '/admin/news',
        icon: Newspaper,
        roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'],
      },
      {
        label: 'Leadership & Team',
        path: '/admin/team',
        icon: Users,
        roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'],
      },
      {
        label: 'Careers & Jobs',
        path: '/admin/careers',
        icon: Briefcase,
        roles: ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER'],
      },
    ],
  },
  {
    groupName: 'Administration',
    items: [
      {
        label: 'Company Profile',
        path: '/admin/company-info',
        icon: Building2,
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        label: 'Staff & Permissions',
        path: '/admin/users',
        icon: ShieldCheck,
        roles: ['SUPER_ADMIN', 'ADMIN'],
      },
    ],
  },
];

const getHeaderInfo = (pathname: string) => {
  if (pathname.startsWith('/admin/company-info')) {
    return {
      title: 'Company & Brand Profile',
      description: 'Manage corporate identity, office locations, official hotlines, and social links.',
    };
  }
  if (pathname.startsWith('/admin/products')) {
    return {
      title: 'Agro Produce Catalog',
      description: 'Manage agricultural inventory, SKUs, pricing, and stock status.',
    };
  }
  if (pathname.startsWith('/admin/orders')) {
    return {
      title: 'Customer Orders',
      description: 'Process incoming orders, track delivery milestones, and reconcile payments.',
    };
  }
  if (pathname.startsWith('/admin/projects')) {
    return {
      title: 'Real Estate Portfolio',
      description: 'Manage residential complexes, commercial towers, and landmark developments.',
    };
  }
  if (pathname.startsWith('/admin/inquiries')) {
    return {
      title: 'Messages & Inquiries Inbox',
      description: 'Unified inbox for partnership proposals, IT consultations, property leads, and general communications.',
    };
  }
  if (pathname.startsWith('/admin/it')) {
    return {
      title: 'Bayt IT Solutions',
      description: 'Manage technology services, capabilities, and enterprise client case studies.',
    };
  }
  if (pathname.startsWith('/admin/news')) {
    return {
      title: 'News & Press Management',
      description: 'Publish and manage group press releases and business vertical milestones.',
    };
  }
  if (pathname.startsWith('/admin/team')) {
    return {
      title: 'Leadership & Team Management',
      description: 'Manage executive leadership board, department directors, and staff profiles.',
    };
  }
  if (pathname.startsWith('/admin/careers')) {
    return {
      title: 'Careers & Job Postings',
      description: 'Post employment opportunities and review incoming candidate applications.',
    };
  }
  if (pathname.startsWith('/admin/users')) {
    return {
      title: 'Staff Accounts & Permissions (RBAC)',
      description: 'Manage staff credentials, invitations, and role-based operational access control.',
    };
  }
  return {
    title: 'Executive Dashboard',
    description: 'Centralized governance & operations overview for BaytBD Group.',
  };
};

interface AdminSidebarProps {
  user: any;
  onLogout: () => void;
  onItemClick?: () => void;
}

// Standalone Sidebar Component (outside AdminLayout to prevent re-instantiation)
const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, onLogout, onItemClick }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 font-bold text-xs tracking-wider shadow-sm">
            BD
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-100">
              BAYTBD GROUP
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">
              Administrative Console
            </div>
          </div>
        </div>
        {onItemClick && (
          <button
            onClick={onItemClick}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Groups (Filtered by User RBAC Role) */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        {navGroups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
              if (!item.roles || item.roles.length === 0) return true;
              if (!user) return false;
              if (user.role === 'SUPER_ADMIN') return true;
              return item.roles.includes(user.role);
            }),
          }))
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <div key={group.groupName} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.groupName}
              </div>
              {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onItemClick}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 border-l-2 border-slate-300 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 hover:translate-x-1'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${
                      isActive
                        ? 'text-slate-100 scale-105'
                        : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-110'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / User Session */}
      <div className="p-4 border-t border-slate-800 space-y-3 flex-shrink-0">
        {/* Quick Link to Public Portal */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 hover:translate-x-1 transition-all duration-150 group"
        >
          <span className="flex items-center space-x-2 truncate">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors flex-shrink-0" />
            <span className="truncate">View Public Site</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700 flex-shrink-0">
            Live
          </span>
        </Link>

        {/* User Profile Card */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-slate-700 flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs uppercase flex-shrink-0">
                {user?.name ? user.name[0] : 'A'}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-medium text-slate-200 truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1">
                <Shield className="w-2.5 h-2.5 inline text-slate-400" />
                <span>{user?.role || 'Admin'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const headerInfo = getHeaderInfo(location.pathname);
  usePageTitle(headerInfo.title);

  // If auth is still validating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-slate-700 border-t-slate-300 rounded-full animate-spin" />
          <span>Verifying administrative session...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect to login cleanly via Navigate
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    toast.info('Signed Out', {
      description: 'You have been signed out of the administrative console.',
    });
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex">
      {/* Desktop Sidebar (Fixed Left, Persistent DOM) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30 border-r border-slate-800 shadow-xl">
        <AdminSidebar user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Slide-over Sidebar Drawer with Smooth Transition */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileSidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileSidebarOpen}
      >
        {/* Backdrop Overlay */}
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />

        {/* Sliding Drawer */}
        <div
          className={`fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-10 transition-transform duration-300 ease-out transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminSidebar
            user={user}
            onLogout={handleLogout}
            onItemClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-xs">
          {/* Left: Burger Menu (on mobile/tablet) + Dynamic Page Title & Description */}
          <div className="flex items-center space-x-3.5 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors flex-shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                {headerInfo.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-normal truncate mt-0.5 hidden xs:block">
                {headerInfo.description}
              </p>
            </div>
          </div>

          {/* Right: Quick System Status / Profile Pill */}
          <div className="flex items-center space-x-2.5 flex-shrink-0 text-xs">
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Building2,
  Cpu,
  Mail,
  RefreshCw,
  Clock,
  ArrowRight,
  Package,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi, agroApi, devApi } from '../../services/api';
import { Order } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, inqRes] = await Promise.all([
        cmsApi.getAdminStats(),
        agroApi.getAdminOrders(),
        cmsApi.getAdminGeneralInquiries(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setRecentOrders(ordersRes.orders.slice(0, 5));
      if (inqRes.success) setRecentInquiries((inqRes.inquiries || []).slice(0, 5));
    } catch (err: any) {
      toast.error('Failed to load dashboard metrics', {
        description: err.response?.data?.message || 'Could not fetch data.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid - Responsive for Short Devices */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <ShoppingBag className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Orders
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.totalOrders ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">Total Agro Orders</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Pending
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.pendingOrders ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">Unfulfilled Orders</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <Package className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Agro
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.totalProducts ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">Live Products</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Assets
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.totalProjects ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">Properties</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <Cpu className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Tech
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.totalServices ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">IT Services</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between text-slate-400">
            <Mail className="w-4 h-4 text-slate-600" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Leads
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {stats?.pendingInquiries ?? '-'}
          </div>
          <div className="text-[11px] text-slate-500 truncate">New Inquiries</div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="font-bold text-slate-900 text-xs">Quick Management Shortcuts</div>
          <div className="text-[11px] text-slate-500">Instantly register entries into respective databases.</div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Agro Product</span>
          </Link>
          <Link
            to="/admin/projects"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Summary Sections: Enhanced List Item Hover Effects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Orders Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Customer Orders</h2>
              <p className="text-[11px] text-slate-400">Latest e-commerce purchases from Bayt Agro.</p>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:translate-x-0.5 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading orders...</div>
          ) : recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No orders recorded yet.</div>
          ) : (
            <div className="space-y-1.5">
              {recentOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-xs transition-all duration-150 flex items-center justify-between text-xs group cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {o.customerName} <span className="text-slate-400 font-mono font-normal">({o.orderNumber})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {o.items.length} item(s) • {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-slate-900">৳{o.totalAmount.toLocaleString()}</div>
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 mt-0.5 group-hover:bg-slate-200 transition-colors">
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Messages & Inquiries</h2>
              <p className="text-[11px] text-slate-400">Partnership requests, consultations & client leads.</p>
            </div>
            <Link
              to="/admin/inquiries"
              className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:translate-x-0.5 transition-all"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading messages...</div>
          ) : recentInquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No inquiries recorded yet.</div>
          ) : (
            <div className="space-y-1.5">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-xs transition-all duration-150 flex items-center justify-between text-xs group cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {inq.name}{' '}
                      {inq.company && <span className="text-slate-400 font-normal">({inq.company})</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      <span className="font-semibold text-slate-600">
                        [{inq.departmentTarget === 'PARTNERSHIP' ? 'Partner Request' : inq.departmentTarget || 'General'}]
                      </span>{' '}
                      {inq.subject || inq.message}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 font-mono flex-shrink-0">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

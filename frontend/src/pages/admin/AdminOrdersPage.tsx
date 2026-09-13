import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';
import { agroApi } from '../../services/api';
import { Order } from '../../types';
import { OrderInvoiceModal } from '../../components/admin/OrderInvoiceModal';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await agroApi.getAdminOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err: any) {
      toast.error('Failed to load orders', {
        description: err.response?.data?.message || 'Please verify connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await agroApi.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res.success) {
        toast.success('Order Status Updated', {
          description: `Order #${res.order.orderNumber} is now ${newStatus}.`,
        });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, orderStatus: res.order.orderStatus } : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: res.order.orderStatus });
        }
      }
    } catch (err: any) {
      toast.error('Status Update Failed', {
        description: err.response?.data?.message || 'Could not update status.',
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'ALL' || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PROCESSING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Filter and Search Bar: Responsive for Short Devices */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by order #, name, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs text-xs flex-shrink-0"
            title="Refresh orders"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Orders Table with Enhanced Hover Effects */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading orders...</div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No customer orders match the current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 min-w-[700px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Delivery Destination</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {o.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{o.customerName}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{o.customerPhone}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[150px]">
                        {o.customerEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="truncate text-slate-800 font-medium">{o.city}</div>
                      <div className="truncate text-slate-400 text-[11px]">{o.deliveryAddress}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {o.items.slice(0, 2).map((it) => (
                          <div key={it.id} className="text-[11px] truncate max-w-[160px]">
                            <span className="font-semibold text-slate-700">{it.quantity}x</span>{' '}
                            {it.productName}
                          </div>
                        ))}
                        {o.items.length > 2 && (
                          <div className="text-[10px] text-slate-400">
                            +{o.items.length - 2} more item(s)
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ৳{o.totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200">
                        {o.paymentMethod}
                      </span>
                      {o.transactionId && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[100px]">
                          Trx: {o.transactionId}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border focus:outline-none transition ${getStatusBadge(
                          o.orderStatus
                        )}`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => setInvoiceOrder(o)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Print Official Tax Invoice / Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="View Full Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal: Responsive for Short Devices */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Customer Profile */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  Customer Information
                </div>
                <div className="font-semibold text-slate-900">{selectedOrder.customerName}</div>
                <div className="flex items-center space-x-1.5 text-slate-500 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-500">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.customerEmail}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                  Shipping Destination
                </div>
                <div className="flex items-start space-x-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div>{selectedOrder.deliveryAddress}</div>
                    <div className="font-semibold text-slate-800">{selectedOrder.city}</div>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                    "{selectedOrder.notes}"
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-[10px] font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                Purchased Commodities
              </div>
              <div className="divide-y divide-slate-100">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{it.productName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {it.quantity} x ৳{it.unitPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900">
                      ৳{it.totalPrice.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 p-3.5 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono">৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Logistics / Shipping Fee</span>
                  <span className="font-mono">৳{selectedOrder.shippingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="font-mono">৳{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Status Change Control in Modal */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-medium">Update status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice / Sales Receipt Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
};

export default AdminOrdersPage;

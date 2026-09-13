import React from 'react';
import { Printer, X, Download, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../../types';
import { printElement } from '../../utils/printHelper';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    printElement('order-invoice-printable', `Invoice-${order.orderNumber}`);
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 print:p-0">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 z-10 max-h-[95vh] flex flex-col overflow-hidden">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tax Invoice & Customer Receipt
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-white border border-slate-200 text-slate-700">
              #{order.orderNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          <div id="order-invoice-printable" className="max-w-2xl mx-auto text-slate-900 font-sans">
            {/* Invoice Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-xl font-black uppercase tracking-wider text-slate-900">
                  BAYTBD GROUP
                </div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  Bayt Agro Division • Commercial Sales & Logistics
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Level 8, Bayt Tower, Gulshan-2, Dhaka 1212, Bangladesh<br />
                  Hotline: +880 9612-000000 • Email: agro@baytbd.com • Web: www.baytbd.com
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Tax Invoice
                </div>
                <div className="text-xs font-mono">
                  <span className="text-slate-500">Invoice No:</span>{' '}
                  <span className="font-bold">INV-{order.orderNumber}</span>
                </div>
                <div className="text-xs font-mono mt-0.5">
                  <span className="text-slate-500">Date:</span>{' '}
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Customer & Order Metadata Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Billed & Shipped To
                </div>
                <div className="font-bold text-sm text-slate-900 mb-0.5">
                  {order.customerName}
                </div>
                <div className="text-slate-600 font-mono">{order.customerPhone}</div>
                <div className="text-slate-600">{order.customerEmail}</div>
                <div className="text-slate-700 mt-1.5 leading-snug">
                  {order.deliveryAddress}, {order.city}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Payment & Delivery Details
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Method:</span>
                    <span className="font-semibold uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-semibold font-mono">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivery Status:</span>
                    <span className="font-semibold uppercase">{order.orderStatus}</span>
                  </div>
                  {order.transactionId && (
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 font-mono text-[11px]">
                      <span className="text-slate-500">Trx ID:</span>
                      <span className="font-semibold text-slate-800">{order.transactionId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-4 w-10 text-center">#</th>
                    <th className="py-2.5 px-4">Item Description</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Total (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-900">
                          {item.productName}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                          ৳{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-800">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                          ৳{item.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No item records attached to this invoice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Totals Calculation */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono">৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span className="font-mono">৳{order.shippingFee.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base">৳{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 mb-8">
                <span className="font-bold text-slate-700">Special Instructions: </span>
                {order.notes}
              </div>
            )}

            {/* Footer / Sign-off */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500 page-break-inside-avoid">
              <div className="max-w-xs text-[11px] leading-relaxed">
                <p className="font-semibold text-slate-700 mb-0.5">Quality Guarantee</p>
                <p>
                  All agricultural shipments are sealed and verified at source. For issues, contact support within 24 hours of delivery.
                </p>
              </div>

              <div className="text-center w-48">
                <div className="border-b border-slate-300 pb-1 mb-1 font-mono text-[10px] text-slate-400">
                  Authorized Signatory
                </div>
                <div className="font-bold text-slate-800 text-[11px]">
                  Bayt Agro Accounts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;

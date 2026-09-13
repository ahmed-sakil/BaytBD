import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Truck, ShieldCheck, ArrowLeft, CreditCard, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';
import { agroApi } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { t, formatCurrency } = useLanguage();
  usePageTitle(t('checkout.title'));
  const { items, subtotal, clearCart } = useCart();
  const { companyInfo } = useCompany();
  const navigate = useNavigate();

  // Dynamic merchant wallet number from company settings, fallback to standard placeholder
  const merchantWallet =
    companyInfo?.primaryPhone && companyInfo.primaryPhone.startsWith('01')
      ? companyInfo.primaryPhone
      : '01700-000000';

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    city: 'Dhaka',
    paymentMethod: 'COD' as 'COD' | 'BKASH_MANUAL' | 'NAGAD_MANUAL',
    transactionId: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const shippingFee = subtotal > 3000 ? 0 : 80;
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if ((formData.paymentMethod === 'BKASH_MANUAL' || formData.paymentMethod === 'NAGAD_MANUAL') && !formData.transactionId) {
      toast.error('Transaction ID Required', {
        description: 'Please provide the transaction ID from your bKash/Nagad transfer.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId || undefined,
        notes: formData.notes || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await agroApi.createOrder(payload);
      if (res.success) {
        setCompletedOrder(res.order);
        clearCart();
        toast.success(t('checkout.orderSuccess'), {
          description: `Order #${res.orderNumber} confirmed. Thank you!`,
        });
      } else {
        toast.error('Order Failed', { description: res.message });
      }
    } catch (err: any) {
      toast.error('Order Error', {
        description: err.response?.data?.message || 'Failed to place order. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t('checkout.orderSuccess')}</span>
          <h1 className="text-3xl font-black text-slate-900">{t('checkout.thankYou')}</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {t('checkout.orderRecorded')}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 max-w-lg mx-auto text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Order Number:</span>
            <span className="font-mono font-bold text-slate-900">{completedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Recipient:</span>
            <span className="font-bold text-slate-900">{completedOrder.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Phone:</span>
            <span className="font-mono text-slate-900">{completedOrder.customerPhone}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">{t('checkout.paymentMethod')}:</span>
            <span className="font-bold text-slate-900">{completedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
            <span>{t('checkout.total')}:</span>
            <span className="text-emerald-700">{formatCurrency(completedOrder.totalAmount)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center space-x-4">
          <Link
            to="/agro"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-md"
          >
            {t('checkout.continueShopping')}
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            {t('checkout.goToHome')}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-28 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t('checkout.cartEmpty')}</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/agro"
          className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          {t('checkout.browseAgro')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <Link to="/agro" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('checkout.returnToAgro')}</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t('checkout.checkoutDelivery')}</h1>
        <p className="text-xs text-slate-500">{t('checkout.checkoutSub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Delivery Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>{t('checkout.customerDeliveryAddress')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact.name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asifur Rahman"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact.phone')}</label>
                <input
                  type="tel"
                  required
                  placeholder="017xxxxxxxx"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contact.email')}</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('checkout.deliveryAddress')}</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House #, Road #, Sector, Landmark..."
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('checkout.city')}</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  <option value="Dhaka">Dhaka Metropolitan</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Other">Other Districts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('checkout.notes')}</label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{t('checkout.selectPaymentMethod')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition min-h-[72px] ${
                  formData.paymentMethod === 'COD'
                    ? 'border-emerald-700 bg-emerald-50/40 ring-2 ring-emerald-600/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                  className="sr-only"
                />
                <div className="font-bold text-xs text-slate-900">{t('checkout.cod')}</div>
                <div className="text-[10px] text-slate-500 mt-1">{t('checkout.cashOnDeliveryDesc')}</div>
              </label>

              <label
                className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition min-h-[72px] ${
                  formData.paymentMethod === 'BKASH_MANUAL'
                    ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="BKASH_MANUAL"
                  checked={formData.paymentMethod === 'BKASH_MANUAL'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'BKASH_MANUAL' })}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{t('checkout.bkashManual')}</span>
                  <span className="text-[10px] bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded">Manual</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Merchant: {merchantWallet}</div>
              </label>

              <label
                className={`p-4 border rounded-xl cursor-pointer flex flex-col justify-between transition min-h-[72px] ${
                  formData.paymentMethod === 'NAGAD_MANUAL'
                    ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="NAGAD_MANUAL"
                  checked={formData.paymentMethod === 'NAGAD_MANUAL'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'NAGAD_MANUAL' })}
                  className="sr-only"
                />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{t('checkout.nagadManual')}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">Manual</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Merchant: {merchantWallet}</div>
              </label>
            </div>

            {/* If Mobile Banking selected, show TrxID input */}
            {(formData.paymentMethod === 'BKASH_MANUAL' || formData.paymentMethod === 'NAGAD_MANUAL') && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs animate-in fade-in">
                <div className="font-bold text-slate-800">
                  {t('checkout.sendMoneyInstructions')} {formatCurrency(totalAmount)} {t('checkout.toMerchant')}{' '}
                  <span className="font-mono text-emerald-700 font-bold">{merchantWallet}</span> {t('checkout.via')}{' '}
                  {formData.paymentMethod === 'BKASH_MANUAL' ? 'bKash' : 'Nagad'}.
                </div>
                <label className="block font-semibold text-slate-700">{t('checkout.transactionId')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9J87K65LM"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="w-full px-3.5 h-11 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:sticky lg:top-24">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-3">
            {t('checkout.orderSummary')} ({items.length} {t('checkout.itemsCount')})
          </h3>

          <div className="divide-y divide-slate-200 max-h-60 overflow-y-auto pr-1 space-y-2">
            {items.map(({ product, quantity }) => {
              const price = product.discountPrice ?? product.price;
              return (
                <div key={product.id} className="pt-2 flex justify-between text-xs text-slate-700">
                  <div className="pr-2">
                    <div className="font-semibold line-clamp-1">{product.name}</div>
                    <div className="text-slate-400">
                      {quantity} x {formatCurrency(price)}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(price * quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>{t('checkout.subtotal')}:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('checkout.shipping')}:</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? <span className="text-emerald-700 font-bold">{t('checkout.free')}</span> : formatCurrency(shippingFee)}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
              <span>{t('checkout.total')}:</span>
              <span className="text-emerald-700 font-mono font-bold">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full min-h-[48px] py-3.5 bg-slate-900 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-sm transition active:scale-95 flex items-center justify-center space-x-2"
          >
            {submitting ? t('checkout.processingOrder') : `${t('checkout.placeOrder')} (${formatCurrency(totalAmount)})`}
          </button>
        </div>
      </form>
    </div>
  );
};

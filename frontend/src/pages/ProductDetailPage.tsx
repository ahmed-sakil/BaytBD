import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, ArrowRight, ShieldCheck, Check, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { agroApi } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { t, formatCurrency, formatNumber } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  usePageTitle(product?.name || t('nav.agro'));
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await agroApi.getProductBySlug(slug);
        if (res.success) {
          setProduct(res.product);
          setRelated(res.relatedProducts || []);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-28 text-slate-500 text-sm">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto text-center py-28 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been discontinued.</p>
        <Link to="/agro" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold">
          Back to Agro Store
        </Link>
      </div>
    );
  }

  const price = product.discountPrice ?? product.price;
  const img = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80';

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/agro/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      {/* Back button */}
      <Link to="/agro" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition min-h-[44px]">
        <ArrowLeft className="w-4 h-4" />
        <span>{t('agro.backToAgro')}</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <img src={img} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details & Purchase */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5" />
              <span>{product.category?.name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono">SKU: {product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline space-x-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{formatCurrency(price)}</span>
            {product.discountPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-xs text-slate-600 font-mono">/ {product.unit}</span>
            <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              {t('agro.inStock')} ({formatNumber(product.stockQuantity)} {t('agro.available')})
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Benefits */}
          {product.benefits && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">{t('agro.purityGuarantee')}</div>
              <div className="grid grid-cols-1 gap-2">
                {((product.benefits as string[]) || []).map((b, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                    <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{t('agro.quantity')}</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-800">{formatNumber(quantity)}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  setIsCartOpen(true);
                }}
                className="py-3.5 min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition shadow-sm active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('common.addToCart')}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3.5 min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm transition active:scale-95"
              >
                <span>{t('agro.buyNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center space-x-2 text-xs text-slate-600">
              <Truck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{t('agro.fastDelivery')}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center space-x-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>{t('agro.bstiPurity')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && (
        <div className="space-y-4 pt-10 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{t('agro.technicalSpecs')}</h2>
          <div className="overflow-hidden border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left text-slate-600">
              <tbody>
                {Object.entries(product.specifications as Record<string, any>).map(([k, v], i) => (
                  <tr key={k} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="px-5 py-3 font-semibold text-slate-800 capitalize w-1/3 border-r border-slate-200">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="px-5 py-3">{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{t('agro.relatedProduce')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rel) => {
              const rPrice = rel.discountPrice ?? rel.price;
              const rImg = rel.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80';
              return (
                <div key={rel.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 hover:shadow-lg transition">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img src={rImg} alt={rel.name} className="w-full h-full object-cover" />
                  </div>
                  <Link to={`/agro/products/${rel.slug}`} className="block font-bold text-xs text-slate-900 hover:text-emerald-600 line-clamp-1">
                    {rel.name}
                  </Link>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-sm text-slate-900">{formatCurrency(rPrice)}</span>
                    <button
                      onClick={() => addToCart(rel, 1)}
                      className="text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      + {t('common.addToCart')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sprout, Search, ShoppingBag, Check, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { agroApi } from '../services/api';
import { Category, Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const AgroPage: React.FC = () => {
  const { t, formatCurrency, formatNumber } = useLanguage();
  usePageTitle(t('nav.agro'));
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'ALL';
  const { addToCart, setIsCartOpen } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          agroApi.getCategories(),
          agroApi.getProducts({
            category: activeCategory !== 'ALL' ? activeCategory : undefined,
            search: searchTerm || undefined,
          }),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (prodRes.success) setProducts(prodRes.products);
      } catch (err) {
        console.error('Failed to load agro data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, [activeCategory, searchTerm]);

  const handleCategorySelect = (slug: string) => {
    if (slug === 'ALL') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pb-20">
      {/* 1. HERO BANNER */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 px-4 sm:px-8 relative overflow-hidden border-b border-slate-900">
        {/* Ambient Glow Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-semibold tracking-wider uppercase shadow-inner">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bayt Agro • Chemical-Free Organic Harvest</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
            {t('agro.heroTitle')}
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            {t('agro.heroSub')}
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 sm:gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('agro.bstiCert')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{t('agro.freeDeliveryBanner')}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('agro.directSourcing')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80">
          {/* Category Tabs (Touch-friendly & horizontal momentum scrolling) */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('ALL')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                activeCategory === 'ALL'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t('common.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  activeCategory === cat.slug
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box (Min 44px height) */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t('agro.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-11 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800"
            />
          </div>
        </div>

        {/* 3. PRODUCT CATALOG GRID */}
        {loading ? (
          <div className="text-center py-20 text-sm text-slate-500">{t('common.loading')}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
            <Sprout className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <div className="text-base font-bold text-slate-800">{t('agro.noProducts')}</div>
            <p className="text-xs text-slate-500 mt-1">{t('agro.tryAdjusting')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = product.discountPrice ?? product.price;
              const img = product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80';
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {product.discountPrice && (
                        <span className="absolute top-3 left-3 bg-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                          Save {formatCurrency(product.price - product.discountPrice)}
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        SKU: {product.sku}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        {product.category?.name}
                      </div>
                      <Link to={`/agro/products/${product.slug}`}>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {product.benefits && (
                        <div className="pt-2 space-y-1">
                          {((product.benefits as string[]) || []).slice(0, 2).map((b, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                              <Check className="w-3 h-3 text-emerald-700 flex-shrink-0" />
                              <span className="line-clamp-1">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        {formatCurrency(price)}
                        {product.discountPrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                            {formatCurrency(product.price)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">per {product.unit}</div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        setIsCartOpen(true);
                      }}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition active:scale-95 min-h-[40px]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('common.addToCart')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

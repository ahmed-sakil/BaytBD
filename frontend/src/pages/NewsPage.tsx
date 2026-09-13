import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { cmsApi } from '../services/api';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const NewsPage: React.FC = () => {
  const { t } = useLanguage();
  usePageTitle(t('nav.news'));
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsApi.getNews().then((res) => {
      if (res.success) setNews(res.articles);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <div className="space-y-2">
        <div className="text-xs font-bold text-sky-700 uppercase tracking-widest flex items-center space-x-1.5">
          <Newspaper className="w-4 h-4" />
          <span>{t('news.badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('news.heroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          {t('news.heroSub')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">{t('common.loading')}</div>
      ) : news.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-600">
          {t('news.noNews')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {news.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden hover:border-slate-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group block focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <div>
                <div className="aspect-video bg-slate-100 overflow-hidden relative">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
                    {item.category}
                  </div>
                </div>
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-center text-[11px] text-slate-500 space-x-2">
                    <span className="flex items-center space-x-1 font-mono text-slate-400">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{new Date(item.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-sky-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.excerpt}</p>
                </div>
              </div>
              <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-sky-700 transition mt-2 min-h-[44px]">
                <span>{t('news.readStory')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

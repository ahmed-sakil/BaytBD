import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Newspaper, Share2, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../services/api';
import { NewsArticle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from '../utils/usePageTitle';

export const NewsDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  usePageTitle(article?.title || t('nav.news'));
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    cmsApi
      .getNewsBySlug(slug)
      .then((res) => {
        if (res.success && res.article) {
          setArticle(res.article);
        } else {
          setArticle(null);
        }
      })
      .catch((err) => {
        console.error('Failed to load article:', err);
        setArticle(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Article link copied to clipboard');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
        <div className="text-xs text-slate-500">{t('common.loading')}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Newspaper className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{t('news.noNews')}</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          The press release you are looking for does not exist or may have been archived.
        </p>
        <Link
          to="/news"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('news.backToNews')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top Header Navigation */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <button
            onClick={() => navigate('/news')}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('news.backToAll')}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-800 transition border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-xs"
            title="Share article"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-medium">{copied ? t('news.copied') : t('news.share')}</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-8 pt-10 sm:pt-14 space-y-8">
        {/* Category Badge & Date Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold uppercase tracking-wider text-[10px] font-mono border border-sky-200">
              {article.category}
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 font-mono text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('news.officialRelease')}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal border-l-2 border-slate-300 pl-4 py-1 italic bg-slate-50/50 rounded-r-xl">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-video sm:aspect-[21/9] bg-slate-100">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Full Story Content */}
        <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-100">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Article Footer & Return Actions */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {t('news.publishedBy')} <span className="font-semibold text-slate-700">{t('news.baytComms')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('news.shareStory')}</span>
            </button>
            <Link
              to="/news"
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              {t('news.allReleases')}
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;

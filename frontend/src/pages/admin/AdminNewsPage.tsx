import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { cmsApi } from '../../services/api';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'CORPORATE',
    excerpt: '',
    content: '',
    featuredImage: '',
    isPublished: true,
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await cmsApi.getNews();
      if (res.success) {
        setArticles(res.articles);
      }
    } catch (err: any) {
      toast.error('Failed to load articles', {
        description: err.response?.data?.message || 'Could not fetch news articles.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'CORPORATE',
      excerpt: '',
      content: '',
      featuredImage: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (article: any) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featuredImage: article.featuredImage || '',
      isPublished: article.isPublished ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Missing Required Fields', {
        description: 'Please provide article headline and body content.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingArticle) {
        const res = await cmsApi.updateNews(editingArticle.id, formData);
        if (res.success) {
          toast.success('Article Updated', {
            description: `Successfully updated ${res.article.title}.`,
          });
          setArticles((prev) =>
            prev.map((a) => (a.id === editingArticle.id ? res.article : a))
          );
          setModalOpen(false);
        }
      } else {
        const res = await cmsApi.createNews(formData);
        if (res.success) {
          toast.success('Article Published', {
            description: `Successfully published ${res.article.title}.`,
          });
          setArticles((prev) => [res.article, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Error saving article.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await cmsApi.deleteNews(id);
      if (res.success) {
        toast.success('Article Removed', {
          description: 'The article was deleted successfully.',
        });
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete article.',
      });
    }
  };

  const filteredArticles = articles.filter((article) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(term) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(term));
    const matchesCat =
      selectedCategory === 'ALL' || article.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Filter and Action Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search news by headline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white text-slate-700"
            >
              <option value="ALL">All Categories ({articles.length})</option>
              <option value="CORPORATE">Corporate</option>
              <option value="AGRO">Bayt Agro</option>
              <option value="DEVELOPMENT">Bayt Development</option>
              <option value="IT">Bayt IT</option>
            </select>
          </div>

          <button
            onClick={fetchArticles}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition shadow-xs text-xs"
            title="Refresh list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading press updates...</div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <Newspaper className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No articles match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Vertical Category</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredArticles.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={art.featuredImage}
                          alt={art.title}
                          className="w-12 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0 max-w-md">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {art.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            {art.excerpt || art.content}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(art.publishedAt || art.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          art.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {art.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === art.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(art.id)}
                              className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add / Edit Article */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => !submitting && setModalOpen(false)}
          />

          <div className="relative bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingArticle ? 'Edit News Article' : 'Publish Press Release'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingArticle
                    ? `Updating parameters for article`
                    : 'Publish an announcement or press update across BaytBD group portal.'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., BaytBD Group Announces New Sustainable Cold Storage Facility"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Vertical *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                >
                  <option value="CORPORATE">Corporate Conglomerate</option>
                  <option value="AGRO">Bayt Agro</option>
                  <option value="DEVELOPMENT">Bayt Development</option>
                  <option value="IT">Bayt IT</option>
                </select>
              </div>

              <div>
                <ImageUpload
                  label="Featured Article Image"
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  placeholder="https://images.unsplash.com/..."
                  helperText="Upload article banner directly to Cloudinary or paste an image URL"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Excerpt</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short introductory summary displayed on catalog cards..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Content *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed press release body, facts, quotes, and milestone specifics..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded-md text-slate-900 focus:ring-slate-500 w-4 h-4"
                />
                <label htmlFor="isPublished" className="font-medium text-slate-700 cursor-pointer select-none">
                  Make this article immediately live and publicly readable
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNewsPage;

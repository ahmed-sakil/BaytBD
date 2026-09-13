import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { agroApi } from '../../services/api';
import { Product, Category } from '../../types';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    sku: '',
    price: '',
    discountPrice: '',
    stockQuantity: '50',
    unit: 'kg',
    imageUrl: '',
    description: '',
    isFeatured: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        agroApi.getCategories(),
        agroApi.getProducts(),
      ]);
      if (catRes.success) setCategories(catRes.categories);
      if (prodRes.success) setProducts(prodRes.products);
    } catch (err: any) {
      toast.error('Failed to load products', {
        description: err.response?.data?.message || 'Could not fetch catalog.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      sku: '',
      price: '',
      discountPrice: '',
      stockQuantity: '50',
      unit: 'kg',
      imageUrl: '',
      description: '',
      isFeatured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      sku: product.sku || '',
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stockQuantity: String(product.stockQuantity),
      unit: product.unit || 'kg',
      imageUrl: product.images?.[0]?.imageUrl || '',
      description: product.description || '',
      isFeatured: product.isFeatured || false,
    });
    setModalOpen(true);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Missing Required Fields', {
        description: 'Please provide a product title, category, and price.',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        const res = await agroApi.updateProduct(editingProduct.id, formData);
        if (res.success) {
          toast.success('Product Updated', {
            description: `Successfully updated ${res.product.name}.`,
          });
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? res.product : p))
          );
          setModalOpen(false);
        }
      } else {
        const res = await agroApi.createProduct(formData);
        if (res.success) {
          toast.success('Product Created', {
            description: `Successfully added ${res.product.name} to the store.`,
          });
          setProducts((prev) => [res.product, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      toast.error('Action Failed', {
        description: err.response?.data?.message || 'Error saving product.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await agroApi.deleteProduct(productId);
      if (res.success) {
        toast.success('Product Removed', {
          description: 'The product was deleted from the catalog.',
        });
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setDeleteConfirmId(null);
      }
    } catch (err: any) {
      toast.error('Delete Failed', {
        description: err.response?.data?.message || 'Could not delete product.',
      });
    }
  };

  // Filtered list
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategory === 'ALL' || product.categoryId === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Filter and Search Bar: Responsive for Short Devices */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
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
              <option value="ALL">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
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
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Data Table with Enhanced Hover Effects */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
            <div>Loading catalog items...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No products found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 min-w-[650px]">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200 select-none">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const primaryImage =
                    p.images?.[0]?.imageUrl ||
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/90 hover:shadow-[inset_3px_0_0_0_#0f172a] transition-all duration-150 group cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-xs">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">
                              Unit: {p.unit}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {p.category?.name || 'Uncategorized'}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.sku || 'N/A'}
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        ৳{p.price.toLocaleString()}
                        {p.discountPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ৳{p.discountPrice.toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                            p.stockQuantity > 10
                              ? 'bg-slate-100 text-slate-700'
                              : p.stockQuantity > 0
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {p.stockQuantity} {p.unit}s
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {p.isFeatured ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900 text-slate-100">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(p);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition hover:scale-105"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === p.id ? (
                            <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDelete(p.id)}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(p.id);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition hover:scale-105"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add / Edit Product with Max Height & Scroll for Short Devices */}
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
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Agro Product'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingProduct
                    ? `Updating parameters for SKU ${editingProduct.sku || editingProduct.name}`
                    : 'Add a new agricultural product to the public store.'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Organic Kalijira Aromatic Rice"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., AGRO-RICE-01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Regular Price (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 120"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, discountPrice: e.target.value })
                    }
                    placeholder="e.g., 105"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="gram">gram</option>
                    <option value="liter">liter</option>
                    <option value="bag">bag</option>
                    <option value="packet">packet</option>
                    <option value="ton">ton</option>
                    <option value="piece">piece</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <ImageUpload
                    label="Product Image"
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    placeholder="https://images.unsplash.com/..."
                    helperText="Upload a product photo directly to Cloudinary or paste an image URL"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Product specification, origin, and characteristics..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="rounded-md text-slate-900 focus:ring-slate-500 w-4 h-4"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="font-medium text-slate-700 cursor-pointer select-none"
                  >
                    Feature this product on the Agro portal homepage
                  </label>
                </div>
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
                  {submitting
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    imgUrl: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully');
      }
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', detail: '', imgUrl: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      detail: category.detail,
      imgUrl: category.imgUrl
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', detail: '', imgUrl: '' });
    setEditingCategory(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Manage Categories
          </h1>
          <p className="text-gray-400">
            Create and manage mod categories
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="glass-card rounded-2xl p-6">
            <div className="aspect-video bg-gray-700 rounded-xl mb-4 overflow-hidden">
              {category.imgUrl ? (
                <img
                  src={category.imgUrl}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-4xl">📁</span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">
              {category.name}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {category.detail}
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No categories yet
          </h3>
          <p className="text-gray-400 mb-6">
            Create your first category to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            Add Category
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={resetForm}></div>
          
          <div className="relative glass-card rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-modern"
                  placeholder="e.g., Tractors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  required
                  rows={3}
                  className="input-modern resize-none"
                  placeholder="Category description..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imgUrl}
                  onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                  required
                  className="input-modern"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
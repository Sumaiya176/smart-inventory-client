// frontend/src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchCategories, deleteCategory } from '@/redux/slices/categorySlice';
import CreateCategoryModal from '@/components/category/CreateCategoryModal';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // This function runs after category is successfully created
  const handleCategoryCreated = () => {
    // Refresh the categories list
    dispatch(fetchCategories());
    // You can also show a success message, update stats, etc.
    console.log('Category created successfully!');
  };

  // This closes the modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Category deleted successfully');
        dispatch(fetchCategories());
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Category Modal */}
      {isCreateModalOpen && (
        <CreateCategoryModal
          onClose={handleCloseModal}
          onSuccess={handleCategoryCreated}
        />
      )}
    </div>
  );
}
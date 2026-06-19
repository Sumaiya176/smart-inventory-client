// frontend/src/app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchCategories, deleteCategory } from '@/redux/slices/categorySlice';
import CreateCategoryModal from '@/components/category/CreateCategoryModal';

import { Plus, Edit, Trash2, Tag, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import EditCategoryModal from '@/components/category/EditCategoryModal';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const { user } = useAppSelector((state) => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  // Check user role for permissions
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const canEdit = isAdmin || isManager; // Admin and Manager can edit
  const canDelete = isAdmin || isManager; // Admin and Manager can delete
  const canCreate = isAdmin || isManager; // Admin and Manager can create

  const handleCategorySuccess = () => {
    dispatch(fetchCategories());
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const openEditModal = (category: any) => {
    if (!canEdit) {
      toast.error('You don\'t have permission to edit categories');
      return;
    }
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirmation = (id: string, name: string) => {
    if (!canDelete) {
      toast.error('You don\'t have permission to delete categories');
      return;
    }
    setCategoryToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
      dispatch(fetchCategories());
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'VIEWER']}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.role === 'ADMIN' && '👑 Admin: Full access - Create, Edit, and Delete Categories'}
              {user?.role === 'MANAGER' && '📋 Manager: Create, Edit, and Delete Categories'}
              {user?.role === 'VIEWER' && '👁️ Viewer: View Categories only'}
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          )}
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
                
                {/* Action Buttons - Only show for Admin and Manager */}
                {(canEdit || canDelete) && (
                  <div className="flex space-x-2">
                    {canEdit && (
                      <button 
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        onClick={() => openDeleteConfirmation(category.id, category.name)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
                
                {/* {category.products?.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    📦 {category.products.length} products in this category
                  </p>
                )} */}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first category</p>
            {canCreate && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>
        )}

        {/* Create Category Modal */}
        {isCreateModalOpen && (
          <CreateCategoryModal
            onClose={handleCloseCreateModal}
            onSuccess={handleCategorySuccess}
          />
        )}

        {/* Edit Category Modal */}
        {isEditModalOpen && selectedCategory && (
          <EditCategoryModal
            onClose={handleCloseEditModal}
            onSuccess={handleCategorySuccess}
            category={selectedCategory}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-black opacity-40 transition-opacity"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            
            {/* Modal Card Box */}
            <div className="relative w-full max-w-md mx-auto my-6 z-50 p-6 bg-white rounded-xl shadow-xl transform transition-all">
              <div className="flex items-start sm:items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Category
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete category <span className="font-semibold">"{categoryToDelete.name}"</span>?
                    </p>
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Warning: This action cannot be undone. Products in this category will become uncategorized.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row-reverse gap-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
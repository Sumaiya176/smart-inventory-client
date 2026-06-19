// // frontend/src/app/products/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
// import { fetchProducts, deleteProduct } from '@/redux/slices/productSlice';
// import { Plus, Edit, Trash2, Package } from 'lucide-react';
// import toast from 'react-hot-toast';
// import CreateProductModal from '@/components/product/CreateProductModal';
// import Button from '@/components/ui/Button';

// export default function ProductsPage() {
//   const dispatch = useAppDispatch();
//   const { products, loading } = useAppSelector((state) => state.products);
//   console.log('Products loaded:', products);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

//   // This function runs after product is successfully created
//   const handleProductCreated = () => {
//     // Refresh the products list
//     dispatch(fetchProducts({ page: 1, limit: 10 }));
//     // You can also show a success message, update stats, etc.
//     console.log('Product created successfully!');
//   };

//   // This closes the modal
//   const handleCloseModal = () => {
//     setIsCreateModalOpen(false);
//   };

//   const handleDeleteProduct = async (id: string) => {
//     if (confirm('Are you sure you want to delete this product?')) {
//       try {
//         await dispatch(deleteProduct(id)).unwrap();
//         toast.success('Product deleted successfully');
//         dispatch(fetchProducts({ page: 1, limit: 10 }));
//       } catch (error) {
//         toast.error('Failed to delete product');
//       }
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchProducts({ page: 1, limit: 10 }));
//    }, [dispatch]);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Products</h1>
//         <Button onClick={() => setIsCreateModalOpen(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 SKU
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products?.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <Package className="w-5 h-5 text-gray-400 mr-2" />
//                     <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {product?.sku}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   ${Number(product?.price || 0).toFixed(2)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`text-sm font-medium ${
//                     product?.stockQuantity <= product?.minimumStockThreshold 
//                       ? 'text-red-600' 
//                       : 'text-gray-900'
//                   }`}>
//                     {product?.stockQuantity} units
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     product?.status === 'ACTIVE' 
//                       ? 'bg-green-100 text-green-800'
//                       : product?.status === 'OUT_OF_STOCK'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {product?.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button className="text-blue-600 hover:text-blue-900 mr-3">
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteProduct(product.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Create Product Modal */}
//       {isCreateModalOpen && (
//         <CreateProductModal
//           onClose={handleCloseModal}
//           onSuccess={handleProductCreated}
//         />
//       )}
//     </div>
//   );
// }

// frontend/src/app/products/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
// import { fetchProducts, deleteProduct } from '@/redux/slices/productSlice';
// import { Plus, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
// import toast from 'react-hot-toast';
// import CreateProductModal from '@/components/product/CreateProductModal';
// import Button from '@/components/ui/Button';
// import ProtectedRoute from '@/components/common/ProtectedRoute';

// export default function ProductsPage() {
//   const dispatch = useAppDispatch();
//   const { products, loading } = useAppSelector((state) => state.products);
//   console.log('Products loaded:', products);
  
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

//   // Custom confirmation modal states
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<string | null>(null);

//   // This function runs after product is successfully created
//   const handleProductCreated = () => {
//     dispatch(fetchProducts({ page: 1, limit: 10 }));
//     console.log('Product created successfully!');
//   };

//   const handleCloseModal = () => {
//     setIsCreateModalOpen(false);
//   };

//   // Triggers when clicking the trash icon
//   const openDeleteConfirmation = (id: string) => {
//     setProductToDelete(id);
//     setIsDeleteModalOpen(true);
//   };

//   // Triggers when confirming inside our custom modal
//   const handleConfirmDelete = async () => {
//     if (!productToDelete) return;
    
//     try {
//       await dispatch(deleteProduct(productToDelete)).unwrap();
//       toast.success('Product deleted successfully');
//       dispatch(fetchProducts({ page: 1, limit: 10 }));
//     } catch (error) {
//       toast.error('Failed to delete product');
//     } finally {
//       // Clean up states
//       setIsDeleteModalOpen(false);
//       setProductToDelete(null);
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchProducts({ page: 1, limit: 10 }));
//   }, [dispatch]);

//   return (
//     <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'VIEWER']}>
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Products</h1>
//         <Button onClick={() => setIsCreateModalOpen(true)}>
//           <Plus className="w-4 h-4 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 SKU
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Stock
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products?.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <Package className="w-5 h-5 text-gray-400 mr-2" />
//                     <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {product?.sku}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   ${Number(product?.price || 0).toFixed(2)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`text-sm font-medium ${
//                     product?.stockQuantity <= product?.minimumStockThreshold 
//                       ? 'text-red-600' 
//                       : 'text-gray-900'
//                   }`}>
//                     {product?.stockQuantity} units
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     product?.status === 'ACTIVE' 
//                       ? 'bg-green-100 text-green-800'
//                       : product?.status === 'OUT_OF_STOCK'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {product?.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button className="text-blue-600 hover:text-blue-900 mr-3">
//                     <Edit className="w-4 h-4" />
//                   </button>
//                   <button 
//                     onClick={() => openDeleteConfirmation(product.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Create Product Modal */}
//       {isCreateModalOpen && (
//         <CreateProductModal
//           onClose={handleCloseModal}
//           onSuccess={handleProductCreated}
//         />
//       )}

//       {/* Professional Custom Delete Confirmation Modal */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
//           {/* Backdrop Overlay */}
//           <div 
//             className="fixed inset-0 bg-black opacity-40 transition-opacity"
//             onClick={() => setIsDeleteModalOpen(false)}
//           ></div>
          
//           {/* Modal Card Box */}
//           <div className="relative w-full max-w-md mx-auto my-6 z-50 p-6 bg-white rounded-xl shadow-xl transform transition-all">
//             <div className="flex items-start sm:items-center">
//               <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Delete Product
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from the system.
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Modal Buttons */}
//             <div className="mt-6 flex flex-col sm:flex-row-reverse gap-2">
//               <button
//                 type="button"
//                 onClick={handleConfirmDelete}
//                 className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
//               >
//                 Delete
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setIsDeleteModalOpen(false)}
//                 className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </ProtectedRoute>
//   );
// }

// frontend/src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { fetchProducts, deleteProduct, updateStock } from '@/redux/slices/productSlice';
import { Plus, Edit, Trash2, Package, AlertTriangle, TrendingUp, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import CreateProductModal from '@/components/product/CreateProductModal';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Stock update modal states
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState<any>(null);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [stockAction, setStockAction] = useState<'add' | 'set' | 'remove'>('add');

  // Delete confirmation modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Check user role for permissions
  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const canDelete = isAdmin || isManager; // Admin and Manager can delete
  const canEdit = isAdmin || isManager; // Admin and Manager can edit
  const canCreate = isAdmin || isManager; // Admin and Manager can create
  const canUpdateStock = true; // All roles can update stock

  const handleProductSuccess = () => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const openEditModal = (product: any) => {
    if (!canEdit) {
      toast.error('You don\'t have permission to edit products');
      return;
    }
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Stock update functions
  const openStockModal = (product: any) => {
    setStockProduct(product);
    setStockQuantity(0);
    setStockAction('add');
    setIsStockModalOpen(true);
  };

  const handleStockUpdate = async () => {
    if (!stockProduct) return;
    
    if (stockQuantity <= 0 && stockAction !== 'set') {
      toast.error('Please enter a valid quantity');
      return;
    }

    let finalQuantity = stockQuantity;
    if (stockAction === 'add') {
      finalQuantity = stockProduct.stockQuantity + stockQuantity;
    } else if (stockAction === 'remove') {
      if (stockQuantity > stockProduct.stockQuantity) {
        toast.error(`Cannot remove more than current stock (${stockProduct.stockQuantity})`);
        return;
      }
      finalQuantity = stockProduct.stockQuantity - stockQuantity;
    } else if (stockAction === 'set') {
      if (stockQuantity < 0) {
        toast.error('Stock quantity cannot be negative');
        return;
      }
      finalQuantity = stockQuantity;
    }

    try {
      await dispatch(updateStock({ 
        id: stockProduct.id, 
        quantity: finalQuantity 
      })).unwrap();
      toast.success(`Stock updated successfully! New stock: ${finalQuantity} units`);
      dispatch(fetchProducts({ page: 1, limit: 10 }));
      setIsStockModalOpen(false);
      setStockProduct(null);
    } catch (error: any) {
      console.log('Error updating stock:', error);
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const openDeleteConfirmation = (id: string) => {
    if (!canDelete) {
      toast.error('You don\'t have permission to delete products');
      return;
    }
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchProducts({ page: 1, limit: 10 }));
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'VIEWER']}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.role === 'ADMIN' && '👑 Admin: Full access - Create, Edit, Delete, and Update Stock'}
              {user?.role === 'MANAGER' && '📋 Manager: Create, Edit, Delete, and Update Stock'}
              {user?.role === 'VIEWER' && '👁️ Viewer: View products and Update Stock only'}
            </p>
          </div>
          {canCreate && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products?.map((product) => {
                  const isLowStock = product?.stockQuantity <= product?.minimumStockThreshold;
                  const isCritical = product?.stockQuantity <= 2;
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product?.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product?.category?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(product?.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-semibold ${
                              isCritical ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-gray-900'
                            }`}>
                              {product?.stockQuantity} units
                            </span>
                            {isLowStock && (
                              <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-red-500' : 'text-yellow-500'}`} />
                            )}
                          </div>
                          <div className="w-32 mt-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isCritical ? 'bg-red-600' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ 
                                width: `${Math.min((product?.stockQuantity / product?.minimumStockThreshold) * 100, 100)}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            Threshold: {product?.minimumStockThreshold}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product?.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800'
                            : product?.status === 'OUT_OF_STOCK'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Stock Update Button - Available for ALL roles */}
                          <button 
                            onClick={() => openStockModal(product)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Update Stock"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                          
                          {/* Edit Button - Only for Admin and Manager */}
                          {canEdit && (
                            <button 
                              onClick={() => openEditModal(product)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          
                          {/* Delete Button - Only for Admin and Manager */}
                          {canDelete && (
                            <button 
                              onClick={() => openDeleteConfirmation(product.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>

        {/* Stock Update Modal */}
        {isStockModalOpen && stockProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div 
              className="fixed inset-0 bg-black opacity-40 transition-opacity"
              onClick={() => setIsStockModalOpen(false)}
            ></div>
            
            <div className="relative w-full max-w-md mx-auto my-6 z-50 bg-white rounded-xl shadow-xl transform transition-all">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Update Stock</h2>
                </div>
                <button 
                  onClick={() => setIsStockModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Product Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Product</p>
                  <p className="text-lg font-semibold text-gray-900">{stockProduct.name}</p>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className={`font-semibold ${
                      stockProduct.stockQuantity <= stockProduct.minimumStockThreshold 
                        ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {stockProduct.stockQuantity} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Threshold:</span>
                    <span className="text-gray-900">{stockProduct.minimumStockThreshold} units</span>
                  </div>
                </div>

                {/* Stock Action Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStockAction('add')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        stockAction === 'add'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ➕ Add Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockAction('remove')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        stockAction === 'remove'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ➖ Remove Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockAction('set')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        stockAction === 'set'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      🎯 Set Exact Value
                    </button>
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {stockAction === 'add' && 'Quantity to Add'}
                    {stockAction === 'remove' && 'Quantity to Remove'}
                    {stockAction === 'set' && 'New Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                    autoFocus
                  />
                </div>

                {/* Preview New Stock */}
                {stockQuantity > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {stockAction === 'add' && `📈 New stock will be: ${stockProduct.stockQuantity + stockQuantity} units`}
                      {stockAction === 'remove' && `📉 New stock will be: ${Math.max(0, stockProduct.stockQuantity - stockQuantity)} units`}
                      {stockAction === 'set' && `🎯 New stock will be: ${stockQuantity} units`}
                    </p>
                  </div>
                )}

                {/* Warning for low stock after update */}
                {(stockAction === 'remove' && stockProduct.stockQuantity - stockQuantity <= stockProduct.minimumStockThreshold) ||
                 (stockAction === 'set' && stockQuantity <= stockProduct.minimumStockThreshold) && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        ⚠️ Warning: This will make the stock below or at threshold level
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Modal Buttons */}
              <div className="flex space-x-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStockUpdate}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Product Modal */}
        {isCreateModalOpen && (
          <CreateProductModal
            onClose={handleCloseCreateModal}
            onSuccess={handleProductSuccess}
          />
        )}

        {/* Edit Product Modal */}
        {isEditModalOpen && selectedProduct && (
          <CreateProductModal
            onClose={handleCloseEditModal}
            onSuccess={handleProductSuccess}
            productToUpdate={selectedProduct}
          />
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div 
              className="fixed inset-0 bg-black opacity-40 transition-opacity"
              onClick={() => setIsDeleteModalOpen(false)}
            ></div>
            
            <div className="relative w-full max-w-md mx-auto my-6 z-50 p-6 bg-white rounded-xl shadow-xl transform transition-all">
              <div className="flex items-start sm:items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Product
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from the system.
                    </p>
                  </div>
                </div>
              </div>
              
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
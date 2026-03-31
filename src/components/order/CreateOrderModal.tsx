// frontend/src/components/orders/CreateOrderModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/useRedux';
import { createOrder } from '@/redux/slices/orderSlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import toast from 'react-hot-toast';
import { X, ShoppingCart, Plus, Trash2, User, Mail, Phone } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CreateOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({ onClose, onSuccess }: CreateOrderModalProps) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const addItem = () => {
    if (!selectedProductId) {
      toast.error('Please select a product');
      return;
    }
    
    if (items.some(item => item.productId === selectedProductId)) {
      toast.error('Product already added to order');
      return;
    }
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    if (product.status !== 'ACTIVE') {
      toast.error('This product is not available');
      return;
    }
    
    if (quantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} units available`);
      return;
    }
    
    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      subtotal: product.price * quantity
    };
    
    setItems([...items, newItem]);
    setSelectedProductId('');
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    const product = products.find(p => p.id === items[index].productId);
    if (!product) return;
    
    if (newQuantity > product.stockQuantity) {
      toast.error(`Only ${product.stockQuantity} units available`);
      return;
    }
    
    const updatedItems = [...items];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].subtotal = updatedItems[index].price * newQuantity;
    setItems(updatedItems);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customer.name.trim()) newErrors.customerName = 'Customer name is required';
    if (items.length === 0) newErrors.items = 'At least one product is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await dispatch(createOrder({
        customerName: customer.name,
        customerEmail: customer.email || undefined,
        customerPhone: customer.phone || undefined,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        notes: notes || undefined
      })).unwrap();
      
      toast.success('Order created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline w-4 h-4 mr-1" />
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="john@example.com"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="inline w-4 h-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            
            {/* Add Item Form */}
            <div className="flex space-x-2 mb-4">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Product</option>
                {products.filter(p => p.status === 'ACTIVE').map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price} (Stock: {product.stockQuantity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Items Table */}
            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Subtotal</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.productName}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.subtotal.toFixed(2)}</td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
                      <td className="px-4 py-3 text-lg font-bold text-gray-900">${totalAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                No items added yet. Select products above.
              </div>
            )}
            {errors.items && <p className="mt-1 text-sm text-red-600">{errors.items}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Special instructions, delivery notes, etc."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : `Create Order ($${totalAmount.toFixed(2)})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
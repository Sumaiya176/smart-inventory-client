// src/redux/hooks/useProducts.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  setFilters,
  clearFilters,
  setPage,
} from '../slices/productSlice';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { products, selectedProduct, loading, error, pagination, filters } = useAppSelector(
    (state) => state.products
  );

  const getProducts = (params?: any) => {
    dispatch(fetchProducts({ ...filters, ...params, page: pagination.page }));
  };

  const getProduct = (id: string) => {
    dispatch(fetchProductById(id));
  };

  const addProduct = (data: any) => {
    return dispatch(createProduct(data)).unwrap();
  };

  const editProduct = (id: string, data: any) => {
    return dispatch(updateProduct({ id, data })).unwrap();
  };

  const removeProduct = (id: string) => {
    return dispatch(deleteProduct(id)).unwrap();
  };

  const changeStock = (id: string, quantity: number) => {
    return dispatch(updateStock({ id, quantity })).unwrap();
  };

  const applyFilters = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const changePage = (page: number) => {
    dispatch(setPage(page));
  };

  useEffect(() => {
    getProducts();
  }, [pagination.page, filters]);

  return {
    products,
    selectedProduct,
    loading,
    error,
    pagination,
    filters,
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
    changeStock,
    applyFilters,
    resetFilters,
    changePage,
  };
};
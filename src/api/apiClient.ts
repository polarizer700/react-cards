import type { AxiosResponse } from 'axios';
import type { Product } from '@/types';
import axios from 'axios';

const API_BASE_URL = 'https://fakestoreapi.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response: AxiosResponse<Product[]> = await apiClient.get('/products');
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
    throw error;
  }
};

export const createProduct = async (newProductData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await apiClient.post('/products', newProductData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, updatedProductData: Partial<Omit<Product, 'id'>>): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await apiClient.put(`/products/${id}`, updatedProductData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    throw error;
  }
};

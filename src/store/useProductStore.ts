// src/store/useProductStore.ts
import type { Product } from '@/types';
import { create } from 'zustand';
import { createProduct as apiCreateProduct } from '@/api/apiClient'; // Импортируем новую функцию

type ProductStore = {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => void;
  createProduct: (productData: Omit<Product, 'id' | 'liked'>) => Promise<void>; // Новый экшн, возвращающий Promise
  setSearchTerm: (term: string) => void;
  getFilteredProducts: (filter: 'all' | 'liked') => Product[];
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  searchTerm: '',

  setProducts: products => set({ products, loading: false, error: null }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error, loading: false }),

  toggleLike: id =>
    set(state => ({
      products: state.products.map(p =>
        p.id === id ? { ...p, liked: !p.liked } : p,
      ),
    })),

  deleteProduct: id =>
    set(state => ({
      products: state.products.filter(p => p.id !== id),
    })),

  // Новый экшн createProduct: вызывает API и обновляет store
  createProduct: async (productData) => {
    set({ loading: true, error: null }); // Устанавливаем состояние загрузки
    try {
      const createdProduct = await apiCreateProduct(productData); // Вызываем API функцию
      // Обновляем store, добавив созданный продукт с liked: false
      set(state => ({
        products: [...state.products, { ...createdProduct, liked: false }],
        loading: false, // Сбрасываем загрузку
      }));
    } catch (err) {
      set({ error: 'Ошибка при создании продукта', loading: false }); // Устанавливаем ошибку
      console.error(err);
      throw err; // Пробрасываем ошибку, чтобы компонент мог её обработать, если нужно
    }
  },

  setSearchTerm: term => set({ searchTerm: term }),

  getFilteredProducts: (filter) => {
    const { products, searchTerm } = get();
    let filtered = products;

    if (filter === 'liked') {
      filtered = filtered.filter(p => p.liked);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(lowerSearchTerm)
          || p.description.toLowerCase().includes(lowerSearchTerm)
          || p.category.toLowerCase().includes(lowerSearchTerm),
      );
    }

    return filtered;
  },
}));

import type { Product } from '@/types';
import { create } from 'zustand';
import { createProduct as apiCreateProduct, updateProduct as apiUpdateProduct } from '@/api/apiClient';

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
  createProduct: (productData: Omit<Product, 'id' | 'liked'>) => Promise<void>;
  updateProduct: (id: number, productData: Partial<Omit<Product, 'id'>>) => Promise<void>;
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

  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const createdProduct = await apiCreateProduct(productData);
      set(state => ({
        products: [...state.products, { ...createdProduct, liked: false }],
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Ошибка при создании продукта', loading: false });
      console.error(err);
      throw err;
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await apiUpdateProduct(id, productData);
      set(state => ({
        products: state.products.map(p => p.id === id ? { ...updatedProduct, liked: p.liked } : p),
        loading: false,
      }));
    } catch (err) {
      set({ error: 'Ошибка при обновлении продукта', loading: false });
      console.error(err);
      throw err;
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

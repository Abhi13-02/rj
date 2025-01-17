import { create } from 'zustand';
import { IProduct } from '@/models/Products';

// Define the Zustand store
interface ProductState {
  products: IProduct[];
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],

  fetchProducts: async () => {
    try {
      // Fetch products from the API
      const response = await fetch('/api/getAllProducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: IProduct[] = await response.json();

      // Sort products by date (newest first)
      const sortedProducts = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order
      });

      console.log("Sorted Products:", sortedProducts);

      // Update Zustand store with sorted products
      set(() => ({ products: sortedProducts }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
}));

export default useProductStore;

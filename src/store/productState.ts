import { create } from 'zustand';
import { QueryClient } from '@tanstack/react-query';
import { IProduct } from '@/models/Products';

// Initialize the React Query client
const queryClient = new QueryClient();

// Define the Zustand store
interface ProductState {
  products: IProduct[];
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  fetchProducts: async () => {
    const queryKey = ['products'];

    // Check if products are already cached
    const cachedData = queryClient.getQueryData<IProduct[]>(queryKey);
    if (cachedData) {
      set(() => ({ products: cachedData }));
      return;
    }

    // Fetch products if not cached
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: async (): Promise<IProduct[]> => {
        const response = await fetch('/api/getAllProducts');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      },
    });

    console.log(data);

    // Update the Zustand store
    set(() => ({ products: data }));
  },
}));

export default useProductStore;

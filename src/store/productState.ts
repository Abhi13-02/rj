import mongoose from 'mongoose';
import { create } from 'zustand';
import { IProduct } from '@/models/Products';

interface ProductState {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set(() => ({ products })),
}));

if (typeof window !== "undefined") {
  (window as any).useProductsStore = useProductStore;
}

export default useProductStore;

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

export default useProductStore;

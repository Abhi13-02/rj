// models/Cart.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface ICart extends Document {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models?.Cart || mongoose.model<ICart>('Cart', CartSchema);

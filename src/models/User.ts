
// import mongoose, { Schema, model, models } from "mongoose";

// const UserSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true},
//   createdAt: { type: Date, default: Date.now },
// });

// const User = models?.User || model("User", UserSchema);

// export default User;


// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image : { type: String, required: false },
    addresses: { type: [AddressSchema], default: [], required: false },
    yourOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    wishlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist' }
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);




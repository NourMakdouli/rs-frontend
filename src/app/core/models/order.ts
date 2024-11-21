import { Blog } from "./blog";
import { CartItem } from "./cartItem";
import { User } from "./user";

export enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Delivered = 'delivered',
}

export interface Order {
  _id: string;
  cartItems: CartItem[];
  totalPrice: number;
  user: User;
  status: OrderStatus; 
  createdAt: Date;
  updatedAt: Date;
  location: string;
  code?:string;
}


export interface UpdateOrderStatusDto {
  status?: OrderStatus;
}

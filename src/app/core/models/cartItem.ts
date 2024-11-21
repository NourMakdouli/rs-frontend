import { Blog } from "./blog";
import { OrderStatus } from "./order";

export  interface CartItem {
  id:string
  title: string;
  price: number;
  total: number;
  image: string;
  quantity: number;
  description:string;
  store: Blog;  status?: OrderStatus; // Add this line
  createdAt?: string;
  updatedAt?: string;

}

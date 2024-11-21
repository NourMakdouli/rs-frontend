import { User } from "./user";

export interface Review {
    _id?: string;
    content: string;
    author: string;           
    reviewedStore: string;  
    rating: number;         
    upvotes?: string[];       
    createdAt?: Date;
    updatedAt?: Date;
  }
  export interface ReviewPerStore {
    _id?: string;
    content: string;
    author: User;           
    reviewedStore: string;  
    rating: number;         
    upvotes?: string[];       
    createdAt?: Date;
    updatedAt?: Date;
    hasPurchased?:boolean;
  }
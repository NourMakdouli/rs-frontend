
export enum DiscountType {
  Product = 'product',
  Products = 'products',
  Store = 'store',
}
export interface Discount {
    _id?: string;
    type: DiscountType;
    percentage: number;
    startDate: Date;
    endDate: Date;
    products?: string[];  
    store?: string; 
    createdAt?: Date;  
    updatedAt?: Date;   
  }
  
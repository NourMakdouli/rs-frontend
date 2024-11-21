export interface Discount {
    _id?: string;
    type: 'product' | 'products' | 'store';
    percentage: number;
    startDate: Date;
    endDate: Date;
    products?: string[];  
    store?: string;    
  }
  
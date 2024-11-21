import { Product } from "./product";

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'INDIVIDUAL' | 'MERCHANT' | 'ADMIN';
  image?: string;

  // Account properties :-)
  mangopay_id?: string;
  mangopayWalletId?: string;
  username?: string;
  birthday?: string;
  phoneNumber?: number;
  nationality?: string;
  countryOfResidence?: string;
  lastip?: string;
  session?: string;
  activation_key?: string;

  // Delivery-related fields
  addressdelievery?: string;
  cityldelivery?: string;
  zipdelivery?: string;
  phonedelivery?: string;
  mobileldelivery?: string;
  favorites?:Product[];
  store?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // two-facotr ya habibi

  isTwoFactorEnabled?: boolean;

// Taken from invitation link because its unecessary to create ALLOFTHAT for 1 property
  referralCode?: string;


  
  tokenBalance?:number;
}

export enum BlogType {
  ACCUPUNCTOR = 'ACCUPUNCTOR',
  RETAIL = 'RETAIL',
  PHARMACY = 'PHARMACY',
  COMMERCIAL = 'COMMERCIAL',
  FRANCHISE = 'FRANCHISE',
  PET = 'PET',
  BOOKSTORE = 'BOOKSTORE',
  GROCERY = 'GROCERY',
  ECOMMERCE = 'ECOMMERCE',
  LUXURY = 'LUXURY',
  SECOND_HAND = 'SECOND_HAND',
  POPUP = 'POPUP',
  SERVICE = 'SERVICE',
  ART_CRAFT = 'ART_CRAFT',
  TECHNOLOGY = 'TECHNOLOGY',
  WELLNESS = 'WELLNESS',
  FITNESS = 'FITNESS',
  AUTOMOTIVE = 'AUTOMOTIVE',
  FURNITURE = 'FURNITURE',
}

export interface Blog {
  _id: string;
  name: string;
  address: string;
  image: string;
  city?: string;
  zipCode?: string;
  blogtype: BlogType;
  phoneNumber?: string;
  description?: string;
  isShown?: boolean;
  siretNumber?: string;
  owner: string;  // Owner's ID
  sponsorship?: number;
  license?: number;
  createdAt?: string;
  updatedAt?: string;
  bankMangoPayId?: string | null;
  twitterLink?: string;
  instagramLink?: string; 
  linkedinLink?: string;
  globalRating: number;  
  numberOfReviews: number; 
  

}



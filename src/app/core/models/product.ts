import { Blog } from "./blog";

export enum ProductType {
    Sale = 'sale',
    Rental = 'rental',
    LifeAnnuity = 'life_annuities'
}

export enum ProductCondition {
    New = 'new',
    Old = 'old'
}

export enum EnergyConsumption {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
}

export class Product {
    _id: string;
    type: ProductType;
    title: string;
    address: string;
    postalCode: string;
    description: string;
    numberOfPieces: number;
    condition: ProductCondition;
    priceExcludingFees: number;
    energyConsumption: EnergyConsumption;
    fees: number;
    numberOfRooms?: number;
    surface: number;
    photos: string[];
    keywords?: string[];
    barcode?: string;
    isPosted?: boolean;
    tva?: string;
    createdAt?: Date;
  updatedAt?: string;
    store: Blog;
    isDiscounted?: boolean;  // New field to store whether the product is discounted
    effectivePrice?: number;  // New field to store the effective price
    discountId?: string | null;  }
// models/job-offer.model.ts

import { BlogType } from "./blog";

export enum JobType {
    SERVER = 'Server',
    DRIVER = 'Driver',
    COOK = 'Cook',
    ESTHETICIAN = 'Esthetician',
    MANAGER = 'Manager',
    CLEANER = 'Cleaner',
    CASHIER = 'Cashier',
    OTHER = 'Other',
  }
  
  export enum ContractType {
    PERMANENT = 'Permanent',
    TEMPORARY = 'Temporary',
  }
  
  export enum TimeType {
    FULL_TIME = 'Full-Time',
    PART_TIME = 'Part-Time',
  }
  
  export enum SalaryType {
    MONTHLY = 'Monthly',
    HOURLY = 'Hourly',
  }
  
  export interface JobOffer {
    _id: string;
    typeOfJob: JobType;
    description?: string;
    contractType: ContractType;
    time: TimeType;
    salaryMin?: number;
    salaryMax?: number;
    salaryType: SalaryType;
    driversLicense?: boolean;
    address?: string;
    immediateHire?: boolean;
    store: string; 
    image: string;
    createdAt?: string;
  updatedAt?: string;

  }
  export interface JobOfferData {
    _id?: string;
    typeOfJob: JobType;
    description?: string;
    contractType: ContractType;
    time: TimeType;
    salaryMin?: number;
    salaryMax?: number;
    salaryType: SalaryType;
    driversLicense?: boolean;
    address?: string;
    immediateHire?: boolean;
    store:{
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
    } ;
    image: string;

  }
  
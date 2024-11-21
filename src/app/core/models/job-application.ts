// models/job-application.model.ts

import { JobType } from "./job-offer";

export enum ApplicationType {
    SPONTANEOUS = 'Spontaneous',
    SPECIFIC = 'Specific',
  }
  
  export interface JobApplication {
    _id?: string;
    typeOfJob: JobType;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    city?: string;
    postalCode?: string;
    description?: string;
    resume?: string; 
    applicationType: ApplicationType;
    isLinkedToJobOffer: boolean;
    jobOffer?: string; 
    createdAt?: string;
  updatedAt?: string;
  }
  
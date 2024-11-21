
export interface Notification {
    _id?: string; 
    userId: string; 
    message: string;
    type: NotificationType; 
    read: boolean;
    createdAt: Date;
  }
  export enum NotificationType{
    ORDER ="ORDER",
    STOCK ="STOCK",
    TOKEN ="TOKEN",
    PAYMENT="PAYMENT",
    JOB="JOB",

    REVIEW="REVIEW",
    PROMOTION="PROMOTION",
    MESSAGE="MESSAGE",
    OTHER="OTHER"
      
    }
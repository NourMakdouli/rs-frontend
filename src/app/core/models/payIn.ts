import { Order } from "./order";

export class MoneyDto {
    Amount: number;
    Currency: string;
  }
  
  export class BrowserInfoDto {
    AcceptHeader: string;
    UserAgent: string;
    ScreenHeight: number;
    ScreenWidth: number;
    TimeZoneOffset: string;
    ColorDepth: number;
    Language: string;
    JavaEnabled: boolean;
    JavascriptEnabled: boolean;
  }
  
  export class CreateCardDirectPayInDto {
    AuthorId: string;
    CardId: string;
    DebitedFunds: MoneyDto;
    Fees: MoneyDto;
    BrowserInfo: BrowserInfoDto;
    SecureModeReturnURL: string;
  }
  export enum PayInStatus {
    PENDING = 'PENDING',
    TRANSFERRED = 'TRANSFERRED',
    PAID = 'PAID',
    FAILED = 'FAILED',
  }
  
  
  export interface PayIn {
    _id: string;
    orderId: string | Order;
    storeId: string;
    amount: number;
    status: PayInStatus;
    createdAt: Date;
    updatedAt: Date;
  }


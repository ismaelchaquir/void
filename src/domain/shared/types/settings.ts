// import { CodeType } from '@prisma/client';
import Decimal from 'decimal.js';

export interface IdentificationConfigOptions {
  storeName: string;
  storeAddress: string;
  storeCity: string;
  storePhone: string;
  storeEmail: string;
  storePOBox?: string;
  storeFax?: string;
  storeAdditional?: string;
  storeSquareLogo?: string;
  storeRectangleLogo?: string;
  language?: string;
  theme?: string;
}

export type CurrencyValue = string | number | Decimal;
export type CurrencyPosition = 'before' | 'after';
export interface CurrencyConfigOptions {
  value?: Decimal;
  // currency: string;
  currencyIso: string;
  preferredCurrency: string;
  currencySymbol: string;
  currencyPosition: CurrencyPosition;
  decimalPrecision: number;
  thousandSeparator: string;
  decimalSeparator: string;
}

export interface DateConfigOptions {
  timeZone: string;
  locale: string;
  formatShort: string;
  formatFull: string;
}

export interface OrderConfigOptions {
  orderCodeType: CodeType;
  allowUnpaidOrders: boolean;
  allowPartialOrders: boolean;
  strictInstalments: boolean;
}

// export type CodeType = 'sequential' | 'random' | 'numberSequential';

export enum CodeType {
  sequential = 'sequential',
  random = 'random',
  numberSequential = 'numberSequential',
}

export interface LayoutConfigOptions {
  posLayout: string;
  saleCompleteSound: string;
  newItemAudio: string;
}

export interface PrintConfigOptions {
  printedDocument: string;
  printingEnabledFor: string;
  printingGateway: string;
}

export interface CashRegisterConfigOptions {
  enableCashRegisters: boolean;
}

export interface VatConfigOptions {
  vatType: string;
}

export interface FeatureConfigOptions {
  showQuantity: boolean;
  mergeSimilarItems: boolean;
  allowWholesalePrice: boolean;
  allowDecimalQuantities: boolean;
  quickProduct: boolean;
  quickProductDefaultUnit: string;
  editableUnitPrice: boolean;
  showPriceWithTax: boolean;
  orderTypes: string;
  numpad: string;
  forceBarcodeAutoFocus: boolean;
  hideExhaustedProducts: boolean;
  hideEmptyCategory: boolean;
}


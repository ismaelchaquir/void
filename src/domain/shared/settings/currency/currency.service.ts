import { Global, Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { CurrencyConfigOptions, CurrencyValue } from '../../types/settings';

@Global()
@Injectable()
export class CurrencyService {
  // Static properties to ensure singleton behavior
  private static _instance: CurrencyService;
  private static _config: CurrencyConfigOptions = {
    currencyIso: 'USD',
    currencySymbol: '$',
    currencyPosition: 'before',
    decimalPrecision: 9,
    decimalSeparator: '.',
    preferredCurrency: 'iso',
    thousandSeparator: ',',
  };

  private _value: Decimal = new Decimal(0);

  constructor() {
    // Ensure only one instance exists
    if (!CurrencyService._instance) {
      CurrencyService._instance = this;
    }
    return CurrencyService._instance;
  }

  // Static method to configure globally
  static configure(config: Partial<CurrencyConfigOptions>): void {
    this._config = {
      ...this._config,
      ...config,
    };
  }

  // Instance method that uses static configuration
  configure(config: Partial<CurrencyConfigOptions>): void {
    CurrencyService.configure(config);
  }

  // Create a fresh instance with current configuration
  fresh(value: CurrencyValue): CurrencyService {
    const freshService = new CurrencyService();
    freshService.configure(CurrencyService._config);
    freshService.setValue(value);
    return freshService;
  }

  static define(amount: number | string | Decimal): CurrencyService {
    const currencyService = new CurrencyService();
    return currencyService.setValue(amount);
  }

  setValue(amount: number | string | Decimal): this {
    this._value = new Decimal(amount);
    return this;
  }

  toString(): string {
    return this.format();
  }

  static multiply(
    first: number | string,
    second: number | string,
  ): CurrencyService {
    return CurrencyService.define(new Decimal(first).mul(new Decimal(second)));
  }

  static divide(
    first: number | string,
    second: number | string,
  ): CurrencyService {
    return CurrencyService.define(new Decimal(first).div(new Decimal(second)));
  }

  static additionate(
    leftOperand: number | string,
    rightOperand: number | string,
  ): CurrencyService {
    return CurrencyService.define(
      new Decimal(leftOperand).plus(new Decimal(rightOperand)),
    );
  }

  static percent(amount: number | string, rate: number): CurrencyService {
    return CurrencyService.define(new Decimal(amount).mul(rate).div(100));
  }

  // Format method using current configuration
  format(): string {
    const config = CurrencyService._config;
    const currency =
      config.preferredCurrency === 'iso'
        ? config.currencyIso
        : config.currencySymbol;

    const formattedValue = new Decimal(this._value)
      .toFixed(config.decimalPrecision)
      .replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandSeparator);

    return config.currencyPosition === 'before'
      ? `${currency} ${formattedValue}`
      : `${formattedValue} ${currency}`;
  }

  get(): number {
    return this._value.toNumber();
  }

  getRaw(value: Decimal | number | null = null): number {
    const config = CurrencyService._config;
    const decimalValue = value ? new Decimal(value) : this._value;
    return decimalValue
      .toDecimalPlaces(config.decimalPrecision, Decimal.ROUND_HALF_UP)
      .toNumber();
  }

  accuracy(number: number): this {
    const config = CurrencyService._config;
    config.decimalPrecision = number;
    return this;
  }

  multipliedBy(number: CurrencyValue): this {
    this._value = this._value.mul(new Decimal(number));
    return this;
  }

  dividedBy(number: CurrencyValue): this {
    const config = CurrencyService._config;
    this._value = this._value
      .div(new Decimal(number))
      .toDecimalPlaces(config.decimalPrecision, Decimal.ROUND_HALF_UP);
    return this;
  }

  subtractBy(number: CurrencyValue): this {
    this._value = this._value.minus(new Decimal(number));
    return this;
  }

  additionateBy(number: CurrencyValue): this {
    this._value = this._value.plus(new Decimal(number));
    return this;
  }

  getPercentageValue(
    value: number | string,
    percentage: number,
    operation: 'additionate' | 'subtract' = 'additionate',
  ): number {
    const percentageValue = new Decimal(value).mul(percentage).div(100);
    return operation === 'additionate'
      ? new Decimal(value).plus(percentageValue).toNumber()
      : new Decimal(value).minus(percentageValue).toNumber();
  }

  toFloat(): number {
    const config = CurrencyService._config;
    return this._value
      .toDecimalPlaces(config.decimalPrecision, Decimal.ROUND_HALF_UP)
      .toNumber();
  }

  // Get current configuration
  getDefault(): CurrencyConfigOptions {
    return CurrencyService._config;
  }
}


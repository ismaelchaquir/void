import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'here we should change to use the username',
    example: 'chaquirbemat@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'password',
    example: '12345678',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignUpDto {
  @IsDefined()
  @IsString()
  userName: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  pobox: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  activationExpiration: Date;

  @IsOptional()
  @IsInt()
  totalSalesCount: number;

  @IsOptional()
  @IsNumber()
  totalSales: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @IsOptional()
  @IsNumber()
  purchasesAmount: number;

  @IsOptional()
  @IsNumber()
  owedAmount: number;

  @IsOptional()
  @IsNumber()
  creditLimitAmount: number;

  @IsOptional()
  @IsNumber()
  accountAmount: number;

  @IsOptional()
  @IsString()
  activationToken: string;

  @IsOptional()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsBoolean()
  rememberToken: string;
}


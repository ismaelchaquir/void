import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  quantity: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

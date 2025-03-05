import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

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

  @ApiProperty({ type: () => [ComponentDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDto)
  @IsOptional()
  components?: ComponentDto[];
}

export class ComponentDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

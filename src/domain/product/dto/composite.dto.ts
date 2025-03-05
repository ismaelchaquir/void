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

export class CreateCompositeProductDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  description: string;

  @ApiProperty({ type: () => [CompositeDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompositeDto)
  @IsOptional()
  components?: CompositeDto[];
}

export class CompositeDto {
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

export class UpdateCompositeProductDto extends PartialType(
  CreateCompositeProductDto,
) {}

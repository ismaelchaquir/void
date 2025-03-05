import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export enum UserType {
  manager,
  user,
}

export class CreateUserDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  type: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class GetProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

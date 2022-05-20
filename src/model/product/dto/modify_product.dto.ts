import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class ModifyProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsString()
  description?: string;
}

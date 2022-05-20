import { IsNotEmpty, IsString } from "class-validator";

export class AllRouterIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}

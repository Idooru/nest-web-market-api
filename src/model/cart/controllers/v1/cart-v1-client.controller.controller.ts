import { Controller, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsClientGuard } from "../../../../common/guards/authenticate/is-client.guard";

@ApiTags("v1 고객 Cart API")
@UseGuards(IsClientGuard)
@Controller("cart-v1-client.controller")
export class CartV1ClientControllerController {
  constructor() {}
}

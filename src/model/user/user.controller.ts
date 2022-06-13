import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dtos/register-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  async register(@Body() body: RegisterUserDto): Promise<any> {
    return this.userService.register(body);
  }
}

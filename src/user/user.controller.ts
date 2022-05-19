import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Json } from './interfaces/json.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}

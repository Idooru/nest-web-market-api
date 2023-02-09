import { Controller } from "@nestjs/common";
import { UserExistService } from "../services/user-exist.service";
import { AuthExistService } from "../../auth/services/auth-exist.service";

@Controller()
export class UserVersionOneExistController {
  constructor(
    private readonly userExistService: UserExistService,
    private readonly authExistService: AuthExistService,
  ) {}
}

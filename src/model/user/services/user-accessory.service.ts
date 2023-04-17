import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";

@Injectable()
export class UserAccessoryService {
  constructor(private readonly userGeneralRepository: UserGeneralRepository) {}

  async findUserWithEmail(email: string) {
    return await this.userGeneralRepository.findUserWithEmail(email);
  }
}

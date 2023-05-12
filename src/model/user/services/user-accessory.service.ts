import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserAccessoryService {
  constructor(private readonly userGeneralRepository: UserGeneralRepository) {}

  async findUserWithEmail(email: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserWithEmail(email);
  }
}

import { Injectable } from "@nestjs/common";
import { UserGeneralRepository } from "../repositories/user-general.repository";
import { UserEntity } from "../entities/user.entity";
import { IUserAccessoryService } from "../interfaces/services/user-accessory-service.interface";

@Injectable()
export class UserAccessoryService implements IUserAccessoryService {
  constructor(private readonly userGeneralRepository: UserGeneralRepository) {}

  async findUserWithEmail(email: string): Promise<UserEntity> {
    return await this.userGeneralRepository.findUserWithEmail(email);
  }
}

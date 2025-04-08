import { Injectable } from "@nestjs/common";
import { UserSearchRepository } from "../repositories/user-search.repository";
import { UserEntity } from "../entities/user.entity";
import { UserProfileRawDto } from "../dto/response/user-profile-raw.dto";
import { ClientUserRawDto } from "../dto/response/client-user-raw.dto";
import { UserBasicRawDto } from "../dto/response/user-basic-raw.dto";
import { FindEntityArgs, Searcher } from "../../../common/interfaces/search/searcher";
import { Implemented } from "../../../common/decorators/implemented.decoration";
import { FindAllUsersDto } from "../dto/request/find-all-users.dto";

@Injectable()
export class UserSearcher implements Searcher<UserEntity, FindAllUsersDto, UserBasicRawDto> {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}

  @Implemented
  public findEntity(args: FindEntityArgs): Promise<UserEntity | UserEntity[]> {
    const { property, alias, getOne, entities } = args;
    if (entities && entities.length) {
      return this.userSearchRepository.findOptionalEntity({ property, alias, entities, getOne });
    }
    return this.userSearchRepository.findPureEntity({ property, alias, getOne });
  }

  @Implemented
  public findAllRaws(dto: FindAllUsersDto): Promise<UserBasicRawDto[]> {
    return this.userSearchRepository.findAllRaws(dto);
  }

  public findUserProfileRaw(id: string): Promise<UserProfileRawDto> {
    return this.userSearchRepository.findUserProfileRaw(id);
  }

  public findClientUserRaw(id: string): Promise<ClientUserRawDto> {
    return this.userSearchRepository.findClientUserRaw(id);
  }
}

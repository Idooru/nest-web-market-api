import { InternalServerErrorException, Logger } from "@nestjs/common";
import { EntityRepository, EntityTarget, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UploadMediaDto } from "../dto/upload-media.dto";

@EntityRepository()
export class MediaUploadRepository<T> extends Repository<T> {
  constructor(private readonly uploadRepository: Repository<T>) {
    super();
  }
  private readonly logger = new Logger("Repository");

  async uploadMediaFile(
    mediaUploadDto: UploadMediaDto,
    entity: EntityTarget<T>,
  ) {
    try {
      const updates = mediaUploadDto as QueryDeepPartialEntity<unknown>;

      await this.uploadRepository
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values(updates)
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}

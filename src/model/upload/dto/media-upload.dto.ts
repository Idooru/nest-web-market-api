import { UserEntity } from "src/model/user/entities/user.entity";

export class MediaUploadDto {
  media: string;
  uploader: UserEntity;
}

import { UserEntity } from "src/model/user/entities/user.entity";

export class MediaUploadDto {
  // 모든 종류의 이미지, 동영상 파일 url
  media: string;
  uploader: UserEntity;
}

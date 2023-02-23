import { UserEntity } from "src/model/user/entities/user.entity";

export class UploadMediaDto {
  // 모든 종류의 이미지, 동영상 파일 url
  url: string;
  uploader: UserEntity;
}

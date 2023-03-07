import { IsEmail, IsString, IsUrl } from "class-validator";

export class UploadMediaDto {
  // 모든 종류의 이미지, 동영상 파일 url
  @IsUrl()
  @IsString()
  url: string;

  @IsEmail()
  @IsString()
  uploader: string;
}

import { PickType } from "@nestjs/mapped-types";
import { VideosEntity } from "../entities/upload.entity";

export class ImageUploadDto extends PickType(VideosEntity, [
  "videoFileName",
  "uploader",
] as const) {}

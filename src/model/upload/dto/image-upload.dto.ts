import { PickType } from "@nestjs/mapped-types";
import { ImagesEntity } from "../entities/upload.entity";

export class ImageUploadDto extends PickType(ImagesEntity, [
  "uploadedImage",
  "uploader",
] as const) {}

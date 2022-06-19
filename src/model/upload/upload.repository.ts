import { ImageUploadDto } from "./dto/image-upload.dto";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ImagesEntity, VideosEntity } from "./entities/upload.entity";
import { Repository } from "typeorm";

@Injectable()
export class UploadRepository {
  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
    @InjectRepository(VideosEntity)
    private readonly videosRepository: Repository<VideosEntity>,
  ) {}

  async uploadImg(imageUploadDto: ImageUploadDto) {
    const { uploader, imageFileName } = imageUploadDto;
    const fileNameOnUrl = `http://localhost:${process.env.PORT}/media/${imageFileName}`;

    const image = await this.imagesRepository.save({
      imageFileName: fileNameOnUrl,
      uploader,
    });

    console.log(image);

    const originalName = fileNameOnUrl.replace(
      `http://localhost:${process.env.PORT}/media/`,
      "",
    );

    return { name: originalName, url: fileNameOnUrl };
  }
}

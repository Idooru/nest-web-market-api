import { MediaEntity } from "src/common/entities/media.entity";

export const brieflyFileName = (media: MediaEntity) =>
  media.url.replace(
    `${process.env.APPLICATION_SCHEME}://${process.env.APPLICATION_HOST}:${process.env.APPLICATION_PORT}/media/`,
    "",
  );

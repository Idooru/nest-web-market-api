import { MediaCookieDto } from "./media-cookie.dto";

export class DeleteMediaFilesDto {
  mediaCookiesDto: MediaCookieDto[];
  prefix: string;
}

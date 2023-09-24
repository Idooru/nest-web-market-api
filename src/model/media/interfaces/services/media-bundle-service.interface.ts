import { MediaCookieDto } from "../../dto/media-cookie.dto";

export interface IMediaBundleService {
  deleteMediaFile(mediaCookies: MediaCookieDto[], mediaPath: string): void;
}

import { MediaDto } from "../../dto/media.dto";

export interface IMediaBundleService {
  deleteMediaFile(mediaCookies: MediaDto[], mediaPath: string): void;
}

import { MediaReturnDto } from "./dto/media-return.dto";

export class MediaUrlCookieValue extends MediaReturnDto {
  whatCookie: string;
}

export class MediaUrlCookies {
  cookies: [string, MediaUrlCookieValue];
}

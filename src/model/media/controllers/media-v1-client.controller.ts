import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Delete,
  Inject,
  Get,
} from "@nestjs/common";
import { MulterConfigService } from "src/common/lib/media/multer-adapt.module";
import { FilesInterceptor } from "@nestjs/platform-express";
import { JsonSendCookiesInterceptor } from "src/common/interceptors/general/json-send-cookies.interceptor";
import { IsLoginGuard } from "src/common/guards/authenticate/is-login.guard";
import { JsonSendCookiesInterface } from "src/common/interceptors/interface/json-send-cookies.interface";
import { JsonClearCookiesInterceptor } from "src/common/interceptors/general/json-clear-cookies.interceptor";
import { JsonClearCookiesInterface } from "src/common/interceptors/interface/json-clear-cookies.interface";
import { MediaCookiesParser } from "src/common/decorators/media-cookies-parser.decorator";
import { IsClientGuard } from "src/common/guards/authenticate/is-client.guard";
import { MediaCookieDto } from "../dto/media-cookie.dto";
import {
  ReviewMediaCookieKey,
  reviewMediaCookieKey,
} from "src/common/config/cookie-key-configs/media-cookie-keys/review-media-cookie.key";
import {
  InquiryMediaCookieKey,
  inquiryMediaCookieKey,
} from "src/common/config/cookie-key-configs/media-cookie-keys/inquiry-media-cookie.key";
import { JsonGeneralInterceptor } from "src/common/interceptors/general/json-general.interceptor";
import { JsonGeneralInterface } from "src/common/interceptors/interface/json-general-interface";
import { ReviewImageEntity } from "../entities/review-image.entity";
import { ReviewVideoEntity } from "../entities/review-video.entity";
import { InquiryRequestImageEntity } from "../entities/inquiry-request-image.entity";
import { InquiryRequestVideoEntity } from "../entities/inquiry-request-video.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MediaSearcher } from "../logic/media.searcher";
import { MediaUpdateService } from "../services/media-update.service";
import { ReviewImageValidatePipe } from "../pipe/exist/review-image-validate.pipe";
import { ReviewVideoValidatePipe } from "../pipe/exist/review-video-validate.pipe";
import { InquiryRequestImageValidatePipe } from "../pipe/exist/inquiry-request-image-validate.pipe";
import { InquiryRequestVideoValidatePipe } from "../pipe/exist/inquiry-request-video-validate.pipe";

@ApiTags("v1 고객 Media API")
@UseGuards(IsClientGuard)
@UseGuards(IsLoginGuard)
@Controller({ path: "/client/media", version: "1" })
export class MediaV1ClientController {
  constructor(
    private readonly mediaSearcher: MediaSearcher,
    private readonly mediaUpdateService: MediaUpdateService,
    @Inject("ReviewMediaCookieKey")
    private readonly reviewMedia: ReviewMediaCookieKey,
    @Inject("InquiryMediaCookieKey")
    private readonly inquiryMedia: InquiryMediaCookieKey,
  ) {}

  @ApiOperation({
    summary: "find uploaded review image",
    description:
      "업로드된 리뷰 이미지를 가져옵니다. 리뷰 이미지를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/review/image")
  async findUploadedReviewImage(
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<ReviewImageEntity[]>> {
    const result = await this.mediaSearcher.findReviewImagesWithId(
      reviewImgCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 리뷰 이미지를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "find uploaded review video",
    description:
      "업로드된 리뷰 비디오를 가져옵니다. 리뷰 비디오를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/review/video")
  async findUploadedReviewVideo(
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<ReviewVideoEntity[]>> {
    const result = await this.mediaSearcher.findReviewVideosWithId(
      reviewVdoCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 리뷰 동영상을 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "find uploaded inquiry request image",
    description:
      "업로드된 문의 요청 이미지를 가져옵니다. 문의 요청 이미지를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry/request/image")
  async findUploadedInquiryRequestImage(
    @MediaCookiesParser(inquiryMediaCookieKey.request.image_url_cookie)
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<InquiryRequestImageEntity[]>> {
    const result = await this.mediaSearcher.findInquiryRequestImagesWithId(
      inquiryRequestImgCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 요청 이미지를 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "find uploaded inquiry request video",
    description:
      "업로드된 문의 요청 비디오를 가져옵니다. 문의 요청 비디오를 가져올 때는 쿠키에 기재된 정보를 사용합니다.",
  })
  @UseInterceptors(JsonGeneralInterceptor)
  @Get("/inquiry/request/video")
  async findUploadedInquiryRequestVideo(
    @MediaCookiesParser(inquiryMediaCookieKey.request.video_url_cookie)
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<JsonGeneralInterface<InquiryRequestVideoEntity[]>> {
    const result = await this.mediaSearcher.findInquiryRequestVideosWithId(
      inquiryRequestVdoCookies,
    );

    return {
      statusCode: 200,
      message: "현재 업로드된 문의 요청 동영상을 가져옵니다.",
      result,
    };
  }

  @ApiOperation({
    summary: "upload review image",
    description:
      "리뷰 이미지를 업로드합니다. 리뷰 이미지는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 리뷰 이미지는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "review_image",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("/images/review"),
    ),
  )
  @Post("/review/image")
  async uploadReviewImage(
    @UploadedFiles(ReviewImageValidatePipe) files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues = await this.mediaUpdateService.uploadReviewImages(
      files,
    );

    return {
      statusCode: 201,
      message: "리뷰 사진을 업로드 하였습니다.",
      cookieKey: this.reviewMedia.image_url_cookie,
      cookieValues,
    };
  }

  @ApiOperation({
    summary: "upload review video",
    description:
      "리뷰 비디오를 업로드합니다. 리뷰 비디오는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 리뷰 비디오는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "review_video",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("videos/review"),
    ),
  )
  @Post("/review/video")
  async uploadReviewVideo(
    @UploadedFiles(ReviewVideoValidatePipe) files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues = await this.mediaUpdateService.uploadReviewVideos(
      files,
    );

    return {
      statusCode: 201,
      message: "리뷰 동영상을 업로드 하였습니다.",
      cookieKey: this.reviewMedia.video_url_cookie,
      cookieValues,
    };
  }

  @ApiOperation({
    summary: "upload inquiry request image",
    description:
      "문의 요청 이미지를 업로드합니다. 문의 요청 이미지는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 문의 요청 이미지는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_request_image",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("images/inquiry/request"),
    ),
  )
  @Post("/inquiry/request/image")
  async uploadInquiryRequestImage(
    @UploadedFiles(InquiryRequestImageValidatePipe)
    files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues =
      await this.mediaUpdateService.uploadInquiryRequestImages(files);

    return {
      statusCode: 201,
      message: "문의 요청 사진을 업로드 하였습니다.",
      cookieKey: this.inquiryMedia.request.image_url_cookie,
      cookieValues,
    };
  }

  @ApiOperation({
    summary: "upload inquiry request video",
    description:
      "문의 요청 비디오를 업로드합니다. 문의 요청 비디오는 api를 호출할 때 최대 5개 업로드가 가능합니다. 업로드된 문의 요청 비디오는 쿠키에 기재되어 다른 api에서 사용이 가능합니다.",
  })
  @UseInterceptors(JsonSendCookiesInterceptor)
  @UseInterceptors(
    FilesInterceptor(
      "inquiry_request_video",
      MulterConfigService.maxContentsCount,
      MulterConfigService.upload("videos/inquiry/request"),
    ),
  )
  @Post("/inquiry/request/video")
  async uploadInquiryRequestVideo(
    @UploadedFiles(InquiryRequestVideoValidatePipe)
    files: Express.Multer.File[],
  ): Promise<JsonSendCookiesInterface<MediaCookieDto>> {
    const cookieValues =
      await this.mediaUpdateService.uploadInquiryRequestVideos(files);

    return {
      statusCode: 201,
      message: "문의 요청 동영상을 업로드 하였습니다.",
      cookieKey: this.inquiryMedia.request.video_url_cookie,
      cookieValues,
    };
  }

  @ApiOperation({
    summary: "cancel review image upload",
    description:
      "리뷰 이미지 업로드를 취소합니다. 클라이언트에 저장되어 있던 리뷰 이미지 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/review/image")
  async cancelReviewImageUpload(
    @MediaCookiesParser(reviewMediaCookieKey.image_url_cookie)
    reviewImgCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey = await this.mediaUpdateService.deleteReviewImagesWithId(
      reviewImgCookies,
    );

    return {
      statusCode: 200,
      message: "리뷰 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @ApiOperation({
    summary: "cancel review video upload",
    description:
      "리뷰 비디오 업로드를 취소합니다. 클라이언트에 저장되어 있던 리뷰 비디오 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/review/video")
  async cancelReviewVideoUpload(
    @MediaCookiesParser(reviewMediaCookieKey.video_url_cookie)
    reviewVdoCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey = await this.mediaUpdateService.deleteReviewVideosWithId(
      reviewVdoCookies,
    );

    return {
      statusCode: 200,
      message: "리뷰 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @ApiOperation({
    summary: "cancel inquiry request image upload",
    description:
      "문의 요청 이미지 업로드를 취소합니다. 클라이언트에 저장되어 있던 문의 요청 이미지 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/request/image")
  async cancelInquiryRequestImageUpload(
    @MediaCookiesParser(inquiryMediaCookieKey.request.image_url_cookie)
    inquiryRequestImgCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey =
      await this.mediaUpdateService.deleteInquiryRequestImagesWithId(
        inquiryRequestImgCookies,
      );

    return {
      statusCode: 200,
      message: "문의 요청 사진 업로드를 취소하였습니다.",
      cookieKey,
    };
  }

  @ApiOperation({
    summary: "cancel inquiry request video upload",
    description:
      "문의 요청 비디오 업로드를 취소합니다. 클라이언트에 저장되어 있던 문의 요청 비디오 쿠키를 제거합니다.",
  })
  @UseInterceptors(JsonClearCookiesInterceptor)
  @Delete("/inquiry/request/video")
  async cancelInquiryRequestVideoUpload(
    @MediaCookiesParser(inquiryMediaCookieKey.request.video_url_cookie)
    inquiryRequestVdoCookies: MediaCookieDto[],
  ): Promise<JsonClearCookiesInterface> {
    const cookieKey =
      await this.mediaUpdateService.deleteInquiryRequestVideosWithId(
        inquiryRequestVdoCookies,
      );

    return {
      statusCode: 200,
      message: "문의 요청 동영상 업로드를 취소하였습니다.",
      cookieKey,
    };
  }
}

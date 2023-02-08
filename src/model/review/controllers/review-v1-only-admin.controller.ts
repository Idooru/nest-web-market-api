import { Controller } from "@nestjs/common";
import { PromiseLibrary } from "src/common/lib/promise.library";
import { ReviewService } from "../providers/review.service";

@Controller("/api/v1/only-admin/review")
export class ReviewVersionOneOnlyAdminController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly promiseLibrary: PromiseLibrary,
  ) {}
}

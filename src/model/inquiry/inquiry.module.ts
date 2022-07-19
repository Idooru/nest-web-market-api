import { Module, forwardRef } from "@nestjs/common";
import { InquiryService } from "./inquiry.service";
import { InquiryController } from "./inquiry.controller";
import { InquiryRepository } from "./providers/inquiry.repository";
import { ProductsEntity } from "../product/entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InquiriesEntity } from "src/model/inquiry/entities/inquiry.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiriesEntity]),
    forwardRef(() => ProductsEntity),
  ],
  controllers: [InquiryController],
  providers: [InquiryService, InquiryRepository],
  exports: [InquiryRepository],
})
export class InquiryModule {}

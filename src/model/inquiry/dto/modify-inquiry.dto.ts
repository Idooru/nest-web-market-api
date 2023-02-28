import { PartialType } from "@nestjs/mapped-types";
import { CreateInquiryDto } from "./create-inquiry.dto";

export class ModifyInquiryDto extends PartialType(CreateInquiryDto) {}

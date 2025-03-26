export class ClientUserRawDto {
  userId: string;
  userRole: string;
  realName: string;
  phoneNumber: string;
  email: string;
  payments: PaymentOnClientUserRaw[];
  reviews: ReviewOnClientUserRaw[];
  inquiryRequests: InquiryRequestOnClientUserRaw[];
}

export class PaymentOnClientUserRaw {
  paymentId: string;
  quantity: number;
  totalPrice: number;
  product: ProductOnPayment;
}

export class ProductOnPayment {
  productId: string;
  productName: string;
  price: number;
  origin: string;
  category: string;
  productImageUrls: string[];
}

export class ReviewOnClientUserRaw {
  reviewId: string;
  reviewTitle: string;
  reviewContent: string;
  starRateScore: number;
  countForModify: number;
  reviewImageUrls: string[];
  reviewVideoUrls: string[];
}

export class InquiryRequestOnClientUserRaw {
  inquiryRequestId: string;
  inquiryRequestTitle: string;
  inquiryRequestContent: string;
  inquiryOption: string;
  isAnswered: boolean;
  inquiryRequestImageUrls: string[];
  inquiryRequestVideoUrls: string[];
}

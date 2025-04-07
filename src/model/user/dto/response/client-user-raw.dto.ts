export class ClientUserRawDto {
  user: User;
  payments: Payment[];
  reviews: Review[];
  inquiryRequests: InquiryRequest[];
}

class User {
  id: string;
  role: string;
  realName: string;
  phoneNumber: string;
  email: string;
}

class Payment {
  id: string;
  quantity: number;
  totalPrice: number;
  product: ProductOnPayment;
}

class ProductOnPayment {
  id: string;
  name: string;
  price: number;
  origin: string;
  category: string;
  imageUrls: string[];
}

class Review {
  id: string;
  title: string;
  content: string;
  starRateScore: number;
  countForModify: number;
  imageUrls: string[];
  videoUrls: string[];
}

class InquiryRequest {
  id: string;
  title: string;
  content: string;
  inquiryOption: string;
  isAnswered: boolean;
  imageUrls: string[];
  videoUrls: string[];
}

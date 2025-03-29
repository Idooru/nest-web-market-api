export class InquiryRequestFromAdminProductRawDto {
  inquiryRequest: InquiryRequest;
  inquiryRequester: InquiryRequester;
  product: Product;
}

class InquiryRequest {
  id: string;
  title: string;
  content: string;
  option: string;
  isAnswered: boolean;
  createdAt: string;
}

class InquiryRequester {
  id: string;
  role: string;
  email: string;
  nickName: string;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

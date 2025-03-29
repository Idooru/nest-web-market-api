export class InquiryRequestBasicRawDto {
  inquiryRequest: InquiryRequest;
  product: Product;
}

class InquiryRequest {
  id: string;
  title: string;
  createdAt: string;
  option: string;
  isAnswered: boolean;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

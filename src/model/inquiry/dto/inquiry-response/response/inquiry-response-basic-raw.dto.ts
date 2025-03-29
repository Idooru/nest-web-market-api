export class InquiryResponseBasicRawDto {
  inquiryResponse: InquiryResponse;
  product: Product;
}

class InquiryResponse {
  id: string;
  title: string;
  createdAt: string;
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export class InquiryResponseDetailRawDto {
  inquiryResponse: InquiryResponse;
  inquiryRequest: InquiryRequest;
  product: Product;
}

class InquiryResponse {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  videoUrls: string[];
}

class InquiryRequest {
  id: string;
  option: string;
  title: string;
  content: string;
  isAnswered: boolean;
  imageUrls: string[];
  videoUrls: string[];
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

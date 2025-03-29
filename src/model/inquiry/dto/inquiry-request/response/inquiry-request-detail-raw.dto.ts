export class InquiryRequestDetailRawDto {
  inquiryRequest: InquiryRequest;
  inquiryResponse: InquiryResponse;
  product: Product;
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

class InquiryResponse {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  videoUrls: string[];
}

class Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

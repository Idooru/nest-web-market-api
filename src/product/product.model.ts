export interface Product {
  id: string;
  name: string;
  price: number;
  origin: string;
  type: string;
  description?: string;
}

export interface Json {
  statusCode: number;
  message: string;
  result?: [] | object;
}

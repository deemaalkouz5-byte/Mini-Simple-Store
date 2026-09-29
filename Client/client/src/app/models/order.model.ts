/*export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  phone: string;
  address: string;
  orderItems: CreateOrderItem[];
}*/
export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItemRequest[];
}

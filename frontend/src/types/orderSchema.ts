export interface OrderSchema {
  orderId: number;
  employee: string;
  orderStatus: string;
  paymentType: string;
  total: number;
  createdAt: string;
  customerPhone: string;
  percentage: number;
  minOrderValue: number;
}

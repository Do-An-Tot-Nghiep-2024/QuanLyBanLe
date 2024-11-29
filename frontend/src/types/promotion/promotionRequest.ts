interface PromotionRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  orderLimit: number;
  minOrderValue: number;
  discountPercent: number;
  isActive: boolean;
}
export default PromotionRequest;

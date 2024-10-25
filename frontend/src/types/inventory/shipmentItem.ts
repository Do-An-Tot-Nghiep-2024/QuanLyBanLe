interface ProductItem {
  name: string;
  quantity: number;
  mxp: Date;
  exp: Date;
  price: number;
  total: number;
}

interface ShipmentItem {
  name: string;
  total: number;
  productItems: ProductItem[];
  createdAt: Date;
}
export default ShipmentItem;

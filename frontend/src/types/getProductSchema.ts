
type Shipment = {
  id: number;
  discount: number;
}
export interface GetProductSchema {
  category: String;
  id: Number;
  image: String;
  name: String;
  originalPrice: Number;
  price: Number;
  shipmentIds: Shipment[];
  supplier: String;
  unit: string;
}

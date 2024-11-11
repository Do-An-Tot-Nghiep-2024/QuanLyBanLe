interface ProductItem {
  name: string;
  quantity: number;
  mxp: Date;
  exp: Date;
  price: number;
  total: number;
  unit:string;
}

interface ItemImportInvoice {
  name: string;
  total: number;
  productItems: ProductItem[];
  createdAt: Date;
}
export default ItemImportInvoice;


interface ProductShipment {
    shipmentId: number;
    productName: string;
    supplier: string;
    mxp: Date;
    exp: Date;
    soldQuantity: number;
    failedQuantity: number;
    availableQuantity: number;
    price: number;
    unit:string;
}
export default ProductShipment;

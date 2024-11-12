
interface ProductShipment {
    shipmentId: number;
    product: string;
    supplier: string;
    mxp: Date;
    exp: Date;
    soldQuantity: number;
    failedQuantity: number;
    availableQuantity: number;
    unit:string;
}
export default ProductShipment;

import { useMemo } from "react";
import {
  MaterialReactTable,

} from "material-react-table";
import { getShipmentsService } from "../../services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import ProductShipment from "../../types/inventory/productShipment";
import { convertDate } from "../../utils/convertDate";

export default function ShipmentPage() {
  // Memoize columns array
  const columns = useMemo(
    () => [
      {
        accessorKey: "shipmentId",
        header: "Mã lô hàng",
      },
      {
        accessorKey: "supplier",
        header: "Tên nhà cung cấp",
      },
      {
        accessorKey: "productName",
        header: "Tên sản phẩm",
      },
      {
        accessorKey: "mxp",
        header: "Ngày sản xuất",
      },
      {
        accessorKey: "exp",
        header: "Ngày hết hạn",
      },
      {
        accessorKey: "soldQuantity",
        header: "Số lượng đã bán",
      },
      {
        accessorKey: "availableQuantity",
        header: "Số lượng còn lại",
      },
      {
        accessorKey: "failedQuantity",
        header: "Số lượng lỗi",
      },
    ],
    []
  );

  // Define function to fetch shipments data
  const getShipments = async () => {
    try {
      const response = await getShipmentsService();
      return response.message === "success" ? response.data : [];
    } catch (error) {
      alert(error);
      return [];
    }
  };

  const formatData = (products: ProductShipment[]) => {
    return products.map((item: ProductShipment) => {
      return {
        shipmentId: "MLH-"+item.shipmentId,
        productName: item.productName,
        supplier: item.supplier,
        mxp: convertDate(item.mxp),
        exp: convertDate(item.exp),
        soldQuantity: item.soldQuantity,
        failedQuantity: item.failedQuantity,
        availableQuantity: item.availableQuantity,
        price: item.price,
        unit: item.unit,
      };
    });
  };
  // Use react-query to handle async data fetching
  const {
    isLoading,
    isError,
    error,
    data: shipmentsData = [],
  } = useQuery({
    queryKey: ["inventory/shipments"],
    queryFn: getShipments,
    refetchOnWindowFocus: false,
  });

  // Memoize the data to prevent re-renders
  const data = useMemo(() => shipmentsData, [shipmentsData]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MaterialReactTable
      columns={columns}
      data={formatData(data)}
      enableColumnOrdering={false}
    />
  );
}

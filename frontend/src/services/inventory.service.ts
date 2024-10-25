import api from "../config/axios";

const getStocksByProductService = async (
  pageNumber: number,
  pageSize: number
) => {
  try {
    const response: any = await api.get(
      `/inventory/stock?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const { message, data } = response;
    if (message !== "success") {
      return {
        message: message,
        data: [],
      };
    }
    return {
      message: message,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred",
      data: [],
    };
  }
};
import ApiResponse from "../types/apiResponse";

const createInventoryOrderService = async (itemList: any[], supplierId:number) => {
  try {
    console.log(itemList);
    console.log(supplierId);
    

    const response: ApiResponse = await api.post(`/inventory/import`, {
      supplierId: supplierId,
      productItems: itemList,
    });

    const { message, data } = response;

    if (message !== "success") {
      return {
        message: message,
        data: {},
      };
    }

    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};

const getImportInvoicesService = async (
  pageNumber: number,
  pageSize: number
) => {
  try {
    const response: any = await api.get(
      `/inventory?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const { message, data } = response;
    if (message !== "success") {
      return {
        message: message,
        data: [],
      };
    }
    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: [],
    };
  }
};

const getShipmentItemsService = async (shipmentId: number) => {
  try {
    const response: any = await api.get(`/inventory/${shipmentId}`);
    const { message, data } = response;
    if (message !== "success") {
      return {
        message: message,
        data: {},
      };
    }
    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};

const getShipmentsService = async () => {
  try {
    const response: any = await api.get(`/inventory`);
    const { message, data } = response;
    if (message !== "success") {
      return {
        message: message,
        data: {},
      };
    }
    return {
      message: message,
      data: data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};



export {
  createInventoryOrderService,
  getStocksByProductService,
  getImportInvoicesService,
  getShipmentItemsService,
  getShipmentsService
};
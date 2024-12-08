import api from "../config/axios";
import UpdateDiscountProduct from "../types/inventory/updateDiscountProduct";


const createInventoryOrderService = async (
  itemList: any[],
  supplierId: number
) => {
  try {
    const response: any = await api.post(`/inventory/import`, {
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
      `/inventory/import-invoices?pageNumber=${pageNumber}&pageSize=${pageSize}`
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

const getItemImportInvoiceService = async (shipmentId: number) => {
  try {
    const response: any = await api.get(
      `/inventory/import-invoices/${shipmentId}`
    );
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
    const response: any = await api.get(`/inventory/shipments`);
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

const updateDiscountProductService = async (request: UpdateDiscountProduct) => {
  try {
      const response:any = await api.put(`/inventory/update-discount-product`, request);
      const { message, data } = response;
      return  {
        message: message,
        data: message === "success" ? data : {},
      }
  } catch (error:any) {
    return {
      message: error.response?.data?.message,
      data: {},
    }
  }
}

export {
  createInventoryOrderService,
  getImportInvoicesService,
  getItemImportInvoiceService,
  getShipmentsService,
  updateDiscountProductService,
};

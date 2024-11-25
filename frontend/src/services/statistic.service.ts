import api from "../config/axios";
import { generateDateDuringWeek } from "../utils/dateUtil";

const getSalesStatisticsByProductService = async () => {
  try {
    const response: any = await api.get("/statistic/product");
    if (response.message !== "success") {
      return {
        status: false,
        data: [],
      };
    }
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: [],
    };
  }
};

const getSalesStatisticsByEmployeeService = async () => {
  try {
    const response: any = await api.get("/statistic/employee");
    if (response.message !== "success") {
      return {
        status: false,
        data: [],
      };
    }
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: [],
    };
  }
};

const getStatisticsProductPriceService = async (productId: number) => {
  try {
    const response: any = await api.get(
      `/statistic/product-price/${productId}`
    );
    if (response.message !== "success") {
      return {
        status: false,
        data: [],
      };
    }
    return {
      status: true,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      data: [],
    };
  }
};

const getSalesBySupplierService = async () => {
  try {
    const response: any = await api.get("/statistic/supplier");
    const { message, data } = response;
    return {
      message: message,
      data: message !== "success" ? [] : data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};

const getSalesAndProfitService = async ({
  fromDateRequest,
  toDateRequest,
}: {
  fromDateRequest: string;
  toDateRequest: string;
}) => {
  try {
    const { fromDate, toDate } = generateDateDuringWeek();
    let from = fromDate;
    let to = toDate;
    if (
      fromDateRequest !== undefined &&
      fromDateRequest !== null &&
      fromDateRequest !== ""
    ) {
      from = fromDateRequest;
    }
    if (
      toDateRequest !== undefined &&
      toDateRequest !== null &&
      toDateRequest !== ""
    ) {
      to = toDateRequest;
    }
    const response: any = await api.get(
      `/statistic/sale-and-profit?fromDate=${from}&toDate=${to}`
    );
    const { message, data } = response;
    return {
      message: message,
      data: message !== "success" ? [] : data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: [],
    };
  }
};

const getTopFiveHighestGrossingService = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  try {
    const response: any = await api.get(
      "/statistic/top-five-highest-grossing-product?fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
    const { message, data } = response;
    return {
      message: message,
      data: message !== "success" ? [] : data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: [],
    };
  }
};

const getBestSellingProductService = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  try {
    const response: any = await api.get(
      "/statistic/best-selling-product?fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
    const { message, data } = response;
    return {
      message: message,
      data: message !== "success" ? [] : data,
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: [],
    };
  }
};

export {
  getSalesStatisticsByProductService,
  getSalesStatisticsByEmployeeService,
  getStatisticsProductPriceService,
  getSalesBySupplierService,
  getSalesAndProfitService,
  getTopFiveHighestGrossingService,
  getBestSellingProductService,
};

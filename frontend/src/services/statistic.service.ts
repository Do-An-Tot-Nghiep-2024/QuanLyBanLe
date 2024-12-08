import api from "../config/axios";
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

const getSalesAndProfitInWeekService = async (next: number) => {
  try {
    const response: any = await api.get(
      `/statistic/sale-and-profit-in-week?next=${next}`
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

const getSalesAndProfitByMonthService = async (month: number) => {
  try {
    const response: any = await api.get(
      `/statistic/sale-and-profit-by-month?month=${month}`
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

const getStockByProductService = async (month: number) => {
  try {
    const respose: any = await api.get(
      `/statistic/stock-by-product?month=${month}`
    );
    console.log(respose);
    const { message, data } = respose;
    return {
      message,
      data: message !== "success" ? [] : data,
    };
  } catch (error: any) {
    return {
      message: error.reponse.data.message,
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

const getExpirationQuantityReportService = async (
  month: number,
  year: number
) => {
  try {
    const response: any = await api.get(
      `/statistic/expiration-quantity?month=${month}&year=${year}`
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
  getSalesAndProfitInWeekService,
  getTopFiveHighestGrossingService,
  getBestSellingProductService,
  getSalesAndProfitByMonthService,
  getStockByProductService,
  getExpirationQuantityReportService,
};

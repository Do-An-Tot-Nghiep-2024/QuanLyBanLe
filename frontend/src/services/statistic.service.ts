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

export {
  getSalesStatisticsByProductService,
  getSalesStatisticsByEmployeeService,
  getStatisticsProductPriceService,
};

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
export { getStocksByProductService };

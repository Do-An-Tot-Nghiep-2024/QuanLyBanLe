import api from "../config/axios";
const getDashboardService = async () => {
  try {
    const response: any = await api.get("/dashboard");
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
      messsage: error.response.data.message,
      data: {},
    };
  }
};
const getDashboardEmployeeService = async () => {
  try {
    const response: any = await api.get("/dashboard/employee");
    const { message, data } = response;
    return {
      message: message,
      data: message === "success" ? data : {},
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: {},
    };
  }
};
export { getDashboardService, getDashboardEmployeeService };

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
  } catch (error) {
    console.log(error);
  }
};
export { getDashboardService };

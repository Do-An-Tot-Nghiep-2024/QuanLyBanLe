import api from "../config/axios";
const getSentNotificationsService = async () => {
  try {
    const response: any = await api.get("/notifications/sent");
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
  } catch (error : any) {
    return {
      message: error.response.data.message,
      data: [],
    };
  }
};
export { getSentNotificationsService };

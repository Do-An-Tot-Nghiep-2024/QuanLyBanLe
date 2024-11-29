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
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: [],
    };
  }
};

const readNotificationsService = async (id: number) => {
  try {
    const response: any = await api.put(`/notifications/${id}`);
    const { message, data } = response;
    return {
      message: message,
      data: message === "success" ? data : "",
    };
  } catch (error: any) {
    return {
      messaage: error.response.data.message,
      data: "",
    };
  }
};

export { getSentNotificationsService,readNotificationsService };

import api from "../config/axios";
// import { GetPromotion } from "../types/getPromotion";
import { PromotionSchema } from "../types/promotionSchema";

interface PromotionResponse {
  message: string;
  data: {
    lastPage: boolean;
    pageNumber: number;
    responseList: PromotionSchema[];
    totalElements: number;
    totalPages: number;
  } | null;
}
const createPromotionService = async (promotionRequest: any) => {
  try {
    const response: any = await api.post(
      "/promotions",
      promotionRequest
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
      message: error.response?.data?.message,
      data: {},
    };
  }
};

const createQuantityPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);

    const response: any = await api.post(
      `/promotions/create-quantity-product-promotion`,
      {
        promotionRequest: promotionData.promotionRequest,
        buyQuantity: promotionData.buyQuantity,
        freeQuantity: promotionData.freeQuantity,
        productId: promotionData.productId,
      }
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

const createGiftProductPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);

    const response: any = await api.post(
      `/promotions/create-gift-product-promotion`,
      {
        promotionRequest: promotionData.promotionRequest,
        buyQuantity: promotionData.buyQuantity,
        giftQuantity: promotionData.giftQuantity,
        giftProductId: promotionData.giftProductId,
        giftShipmentId: promotionData.giftShipmentId,
        productId: promotionData.productId,
      }
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

const createDiscountProductPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);

    const response: any = await api.post(
      `/promotions/create-discount-product`,
      {
        promotionRequest: promotionData.promotionRequest,
        productId: promotionData.productId,
        discount: promotionData.discount,
      }
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
// const getAllProductsService = async (): Promise<GetProductResponse> => {
//   try {
//     const response: GetProductResponse = await api.get(`/products`);
//     const { message, data } = response;

//     console.log(data);

//     return {
//       message,
//       data: message === "success" ? data : null,
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);

//     return {
//       message: String(error),
//       data: null,
//     };
//   }
// };

const getAllPromotionService = async (): Promise<PromotionResponse> => {
  try {
    const response: PromotionResponse = await api.get(`/promotions`);

    const { message, data } = response;

    console.log(data);

    return {
      message,
      data: message === "success" ? data : null,
    };
  } catch (error) {
    console.error("Error fetching promotions:", error);

    return {
      message: String(error),
      data: null,
    };
  }
};

const getLatestPromotionService = async () => {
  try {
    const response: any = await api.get(`/promotions/latest`);

    const { message, data } = response;
    return {
      message,
      data: message === "success" ? data : {},
    };
  } catch (error: any) {
    return {
      message: error.response.data.message,
      data: null,
    };
  }
};


const updatePromotionService = async (promotionId: number, promotionRequest: any) => {
  try {
    const response: any = await api.put(
      `/promotions/${promotionId}`,
      promotionRequest
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
      message: error.response?.data?.message,
      data: {},
    };
  }
}

export {
  createPromotionService,
  createQuantityPromotion,
  createGiftProductPromotion,
  createDiscountProductPromotion,
  getAllPromotionService,
  getLatestPromotionService,
  updatePromotionService,
};

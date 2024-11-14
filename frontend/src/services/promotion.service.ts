import api from "../config/axios";
import ApiResponse from "../types/apiResponse";
import { GetPromotion } from "../types/getPromotion";
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
const createOrderPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);


    const response: ApiResponse = await api.post(`/promotions/create-order-promotion`, {
      promotionRequest: promotionData.promotionRequest,
      minOrderValue: promotionData.minOrderValue,
      discountPercent: promotionData.discountPercent
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
}

const createQuantityPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);


    const response: ApiResponse = await api.post(`/promotions/create-quantity-product-promotion`, {
      promotionRequest: promotionData.promotionRequest,
      buyQuantity: promotionData.buyQuantity,
      freeQuantity: promotionData.freeQuantity,
      productId: promotionData.productId
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
}

const createGiftProductPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);


    const response: ApiResponse = await api.post(`/promotions/create-gift-product-promotion`, {
      promotionRequest: promotionData.promotionRequest,
      buyQuantity: promotionData.buyQuantity,
      giftQuantity: promotionData.giftQuantity,
      giftProductId: promotionData.giftProductId,
      giftShipmentId: promotionData.giftShipmentId,
      productId: promotionData.productId
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
}

const createDiscountProductPromotion = async (promotionData: any) => {
  try {
    console.log(promotionData);


    const response: ApiResponse = await api.post(`/promotions/create-discount-product`, {
      promotionRequest: promotionData.promotionRequest,
      productId: promotionData.productId,
      discount: promotionData.discount
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
}
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
}

const getLatestPromotion = async (): Promise<GetPromotion> => {
    const response = await api.get(`/promotions/latest`);
    if (response) {
      return response.data as GetPromotion;

    }
    return null as unknown as GetPromotion;
}

export { createOrderPromotion, createQuantityPromotion, createGiftProductPromotion, createDiscountProductPromotion, getAllPromotionService, getLatestPromotion }
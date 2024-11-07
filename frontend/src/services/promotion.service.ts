import api from "../config/axios";
import ApiResponse from "../types/apiResponse";

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


export { createOrderPromotion, createQuantityPromotion, createGiftProductPromotion, createDiscountProductPromotion }
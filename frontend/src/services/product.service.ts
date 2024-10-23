import api from "../config/axios";
import { ProductSchema } from "../types/productSchema";
import ApiResponse from "../types/apiResponse";

const createProductService = async (
  productRequest: ProductSchema,
  imageFile: File
) => {
  try {
    const calculatedPrice = productRequest.originalPrice * 1.1;
    const formData = new FormData();
    const productWithCalculatedPrice = {
      ...productRequest,
      price: parseFloat(calculatedPrice.toFixed(2)),
    };

    formData.append(
      "productRequest",
      JSON.stringify(productWithCalculatedPrice)
    );
    formData.append("file", imageFile);

    const response: ApiResponse = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response);
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

const updateProductService = async (
  productRequest: ProductSchema,
  imageFile: File
) => {
  console.log(productRequest);

  try {
    const calculatedPrice = productRequest.originalPrice * 1.1;
    const formData = new FormData();
    const productWithCalculatedPrice = {
      ...productRequest,
      price: parseFloat(calculatedPrice.toFixed(2)),
    };

    formData.append(
      "productRequest",
      JSON.stringify(productWithCalculatedPrice)
    );
    formData.append("file", imageFile);

    const response: ApiResponse = await api.put(
      `/products/${productRequest.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);
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

const getProductsService = async () => {
  try {
    const response: ApiResponse = await api.get("/products");
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
      message: error.response?.data?.message || "An error occurred",
      data: [],
    };
  }
};

const getProductByIdService = async (id: number) => {
  try {
    const response: ApiResponse = await api.get(`/products/${id}`);
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

const deleteProductService = async (id: number) => {
  try {
    const response: ApiResponse = await api.delete(`/products/${id}`);

    console.log(response);

    return {
      data: response.data,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};

export {
  createProductService,
  getProductByIdService,
  getProductsService,
  updateProductService,
  deleteProductService,
};

import api from "../config/axios";
import { GetProductSchema } from "../types/getProductSchema";
import { ProductSchema } from "../types/productSchema";
import ApiResponse from "../types/common/apiResponse";
import { UpdateProductSchema } from "../types/updateProductSchema";
import PaginationResponse from "../types/common/paginationResponse";
import ProductResponse from "../types/product/productResponse";

// interface GetProductResponse {
//   message: string;
//   data: {
//     lastPage: boolean;
//     pageNumber: number;
//     responseList: GetProductSchema[];
//     totalElements: number;
//     totalPages: number;
//   } | null;
// }

const createProductService = async (
  productRequest: ProductSchema,
  imageFile: File
) => {
  try {
    console.log(productRequest);
    console.log(imageFile);
    const formData = new FormData();
    formData.append(
      "productRequest",
      new Blob([JSON.stringify(productRequest)], {
        type: "application/json",
      })
    );
    formData.append("file", imageFile);
    console.log(formData);
    const response: any = await api.post("/products", formData, {
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
  id: number,
  productRequest: UpdateProductSchema,
  imageFile: File
) => {
  try {
    console.log(productRequest);
    console.log(imageFile);

    const formData = new FormData();

    formData.append(
      "productRequest",
      new Blob([JSON.stringify(productRequest)], {
        type: "application/json",
      })
    );
    formData.append("file", imageFile);
    console.log(formData);
    const response: any = await api.put(`/products/${id}`, formData, {
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

// const getProductsService = async (page: number, limit: number) => {
//   try {
//     const response: any = await api.get(
//       `/products?pageNumber=${page}&pageSize=${limit}`
//     );
//     const { message, data } = response;

//     if (message !== "success") {
//       return {
//         message: message,
//         data: [],
//       };
//     }

//     return {
//       message: message,
//       data: data,
//     };
//   } catch (error: any) {
//     return {
//       message: error.response?.data?.message || "An error occurred",
//       data: [],
//     };
//   }
// };

const getProductByIdService = async (id: number) => {
  try {
    const response: any = await api.get(`/products/${id}`);
    const { message, data } = response;

    if (message !== "success") {
      return {
        message: message,
        data: {},
      };
    }

    return {
      message: message,
      data: data as any,
    };
  } catch (error: any) {
    return {
      message: error.response?.data?.message || "An error occurred",
      data: {},
    };
  }
};

const getAllProductsService = async (
  name: string,
  category: string,
  pageNumber: number
) => {
  try {
    const response: ApiResponse<PaginationResponse<ProductResponse>> =
      await api.get(
        `/products?&name=${name}&category=${category}&pageNumber=${pageNumber}&pageSize=6`
      );
    const { message, data } = response;
    return {
      message,
      data: message === "success" ? data : null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      message: String(error),
      data: null,
    };
  }
};
// const getAllProductsByNameService = async (name : string): Promise<GetProductResponse> => {
//   console.log("get all products");

//   try {
//     let searchName = "";
//     if(name) {
//       searchName = name;
//     }
//     const response: GetProductResponse = await api.get(`/products/search?name=${searchName}`);
//     return null as unknown as ResponsePagination<GetProductSchema>;

//   } catch (error) {
//     console.error("Error fetching products:", error);

//     return {
//       message: String(error),
//       data: null,
//     };
//   }
// };

const getAllProductsByNameService = async (
  name: string
): Promise<GetProductSchema[]> => {
  let searchName = "";
  if (name) {
    searchName = name;
  }
  const response = await api.get(`/products/search?name=${searchName}`);

  if (response) {
    // console.log(response);
    return response.data;
  }

  return null as unknown as GetProductSchema[];
};

const getProductsBySupplierService = async (supplierId: number) => {
  try {
    const response: any = await api.get(`/products/supplier/${supplierId}`);
    const message = response?.message;
    const data = response?.data;

    console.log(data);
    return {
      message,
      data: message === "success" ? data : null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);

    return {
      message: String(error),
      data: null,
    };
  }
};

// Define your GetProductSchema interface
// interface GetProductSchema {
//   id: number;
//   name: string;
//   image: string;
//   category: string;
//   supplier: string;
//   price: number;
// }

// Define your API response interface
// interface ApiResponse {
//   message: string;
//   data: GetProductSchema; // Ensure this reflects the actual expected structure
// }

const deleteProductService = async (id: number) => {
  try {
    const response: ApiResponse<string> = await api.delete(`/products/${id}`);

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

const updateProductPriceService = async (productId: number, price: number) => {
  console.log(productId);
  console.log(price);

  try {
    const response: ApiResponse<ProductResponse> = await api.put(
      `/products/${productId}/price`,
      {
        price: price,
      }
    );
    const { message, data } = response;

    console.log(data);

    return {
      message,
      data: message === "success" ? data : null,
    };
  } catch (error:any) {
    return {
      message: error.response?.data?.message,
      data: null,
    };
  }
};

export {
  getAllProductsService,
  createProductService,
  getProductByIdService,
  // getProductsService,
  updateProductService,
  deleteProductService,
  getProductsBySupplierService,
  getAllProductsByNameService,
  updateProductPriceService,
};

package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.order.ProductOrderItemResponse;
import com.bac.se.backend.payload.response.product.ProductCategoryResponse;
import com.bac.se.backend.payload.response.product.ProductImportInvoiceResponse;
import com.bac.se.backend.payload.response.product.ProductMobileResponse;
import com.bac.se.backend.payload.response.product.ProductResponse;
import com.bac.se.backend.payload.response.statistic.product.BestSellingProductResponse;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ProductMapper {
    public ProductResponse mapObjectToProductResponse(Object[] object, List<Long> shipmentIds) {
        return new ProductResponse(
                Long.parseLong(object[0].toString()), // id
                object[1].toString(), // name
                object[2].toString(), // image
                object[3].toString(), // category
                object[4].toString(), // unit
                Double.parseDouble(object[5].toString()), // price
                Double.parseDouble(object[6].toString()), // original price
                shipmentIds // isInShipment
        );
    }

    public ProductImportInvoiceResponse mapObjectToProductShipmentResponse(Object[] object) {
        return new ProductImportInvoiceResponse(
                (String) object[0], // product name
                Integer.parseInt(object[1].toString()), // quantity
                (Date) object[2], // mxp
                (Date) object[3], // exp
                Double.parseDouble(object[4].toString()), // price
                Double.parseDouble(object[5].toString()), // total
                object[6].toString() // unit
        );
    }

    public BestSellingProductResponse mapObjectToBestSellingProduct(Object[] object) {
        return new BestSellingProductResponse(
                object[0].toString(),
                Integer.parseInt(object[1].toString())
        );
    }

    public ProductCategoryResponse mapObjectToProductCategoryResponse(Object[] object) {
        return new ProductCategoryResponse(
                Long.parseLong(object[0].toString()),
                object[1].toString(),
                object[2].toString(),
                Double.parseDouble(object[3].toString()),
                Double.parseDouble(object[4].toString())
        );
    }

    public ProductMobileResponse mapObjectToProductMobileResponse(Object[] object) {
        return new ProductMobileResponse(
                Long.parseLong(object[0].toString()),
                object[1].toString(),
                object[2].toString(),
                Double.parseDouble(object[3].toString()),
                object[4].toString(),
                null
        );
    }

    public ProductOrderItemResponse mapToProductOrderItemResponse(Object[] object) {
        return new ProductOrderItemResponse(
                object[0].toString(),
                Integer.parseInt(object[1].toString()),
                Double.parseDouble(object[2].toString()),
                Double.parseDouble(object[3].toString())
        );
    }
}

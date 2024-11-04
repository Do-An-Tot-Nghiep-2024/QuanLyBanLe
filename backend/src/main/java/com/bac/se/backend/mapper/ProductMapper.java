package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.*;
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
                object[5] == null ? "" : object[5].toString(), // promotion
                Double.parseDouble(object[6].toString()), // price
                Double.parseDouble(object[7].toString()), // discountPrice
                shipmentIds // isInShipment
        );
    }

    public ProductShipmentResponse mapObjectToProductShipmentResponse(Object[] object) {
        return new ProductShipmentResponse(
                (String) object[0], // product name
                Integer.parseInt(object[1].toString()), // quantity
                Integer.parseInt(object[2] == null ? "0" : object[2].toString()), // sold quantity
                Integer.parseInt(object[3] == null ? "0" : object[3].toString()),
                Integer.parseInt(object[4] == null ? "0" : object[4].toString()),
                (Date) object[5], // mxp
                (Date) object[6], // exp
                Double.parseDouble(object[7].toString()), // price
                Double.parseDouble(object[8].toString()), // total
                object[9].toString() // unit
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
                object[3] == null ? "" : object[3].toString(),
                Double.parseDouble(object[4].toString()),
                Double.parseDouble(object[5].toString()),
                null
        );
    }
}

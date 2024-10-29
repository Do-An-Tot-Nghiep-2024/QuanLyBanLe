package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.BestSellingProductResponse;
import com.bac.se.backend.payload.response.product.ProductResponse;
import com.bac.se.backend.payload.response.product.ProductShipmentResponse;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ProductMapper {
    public ProductResponse mapObjectToProductResponse(Object[] object, List<Long> shipmentIds) {
        return new ProductResponse(
                Long.parseLong(object[0].toString()), // id
                (String) object[1], // name
                (String) object[2], // image
                (String) object[3], // category
                (String) object[4], // supplier
                Double.parseDouble(object[5].toString()), // originalPrice
                Double.parseDouble(object[6].toString()), // price
                Double.parseDouble(object[7].toString()),
                object[8] == null ? "" : object[8].toString(), // unit
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

}

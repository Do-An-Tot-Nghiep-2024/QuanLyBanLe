package com.bac.se.backend.mapper;

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
                shipmentIds // isInShipment
        );
    }

    public ProductShipmentResponse mapObjectToProductShipmentResponse(Object[] object) {
        return new ProductShipmentResponse(
                (String) object[0], // product name
                Integer.parseInt(object[1].toString()), // quantity
                (Date) object[2], // mxp
                (Date) object[3], // exp
                Double.parseDouble(object[4].toString()), // price
                Double.parseDouble(object[5].toString()) // total
        );
    }


}

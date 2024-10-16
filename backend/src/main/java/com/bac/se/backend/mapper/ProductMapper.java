package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.product.ProductResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductMapper {
    public ProductResponse mapObjectToProductResponse(Object[] object, List<Long> shipmentIds) {
       return new ProductResponse(
              Long.parseLong(object[0].toString()), // id
               (String) object[1], // name
               (String) object[2], // image
               (String )object[3], // category
               (String) object[4], // supplier
               Double.parseDouble(object[5].toString()), // originalPrice
               Double.parseDouble(object[6].toString()), // price
               Double.parseDouble(object[7].toString()),
               shipmentIds // isInShipment
       );
    }


}

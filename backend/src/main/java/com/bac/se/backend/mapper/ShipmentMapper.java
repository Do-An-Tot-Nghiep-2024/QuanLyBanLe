package com.bac.se.backend.mapper;

import com.bac.se.backend.payload.response.shipment.ProductShipmentResponse;
import com.bac.se.backend.payload.response.shipment.ShipmentResponse;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ShipmentMapper {
    public ShipmentResponse mapToShipmentResponse(Object[] object) {
        return new ShipmentResponse(
                object[0].toString(),
                object[1].toString(),
                (Date) object[2]
        );
    }

    public ProductShipmentResponse mapToShipmentItemResponse(Object[] object) {
        return new ProductShipmentResponse(
                Long.parseLong(object[0].toString()),
                object[1].toString(), // supplier
                object[2].toString(),
                (Date) object[3],
                (Date) object[4],
                Integer.parseInt(object[5].toString()),
                Integer.parseInt(object[6].toString()),
                Integer.parseInt(object[7].toString()),
                object[8].toString()
        );
    }
}

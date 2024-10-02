package com.bac.se.backend.keys;

import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.Shipment;
import lombok.Data;

import java.io.Serializable;

@Data
public class ShipmentItemKey implements Serializable {
    private Product product;
    private Shipment shipment;
}

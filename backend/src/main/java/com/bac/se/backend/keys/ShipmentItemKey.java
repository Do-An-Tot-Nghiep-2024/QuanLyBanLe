package com.bac.se.backend.keys;

import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.Shipment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ShipmentItemKey implements Serializable {
    private Product product;
    private Shipment shipment;

}

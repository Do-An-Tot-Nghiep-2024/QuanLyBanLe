package com.bac.se.backend.keys;

import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.Shipment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentItemKey  {
    private Product product;
    private Shipment shipment;
}

package com.bac.se.backend.keys;


import com.bac.se.backend.models.Order;
import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.Shipment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemKey implements Serializable {
    private Product product;
    private Order order;
    private Shipment shipment;

}

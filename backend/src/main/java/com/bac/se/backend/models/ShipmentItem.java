package com.bac.se.backend.models;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@IdClass(ShipmentItemKey.class)
@Table(name = "t_shipment_item")
public class ShipmentItem {
    @Id
    @ManyToOne
    @JoinColumn(name = "shipment_id")
    private Shipment shipment;
    @Id
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
    private int quantity;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date productionDate;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date expirationDate;
}

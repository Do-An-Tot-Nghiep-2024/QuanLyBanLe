package com.bac.se.backend.models;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@IdClass(ShipmentItemKey.class)
@Table(name = "t_shipment_item")
public class ShipmentItem {

    @Id
    @JoinColumn(name = "product_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private Product product;

    @Id
    @JoinColumn(name = "shipment_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private Shipment shipment;

    private int quantity;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date mxp;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date exp;

    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id")
    private Stock stock;


}

package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShipmentItemRepository extends JpaRepository<ShipmentItem,ShipmentItemKey> {

    // check if shipment item is expired
//    @Query(value = "select p from ShipmentItem p where p.createdAt < :createdAt")
//    Object[] isExpired(ShipmentItemKey key);

    @Query(value = "select p.shipment.id from ShipmentItem p where p.product.id = :productId")
    List<Object[]> getShipmentItemByProduct(Long productId);
}

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

    @Query(value = "select p.name, si.quantity, si.mxp, si.exp, pp.original_price, pp.original_price * si.quantity as total " +
            "from t_shipment_item si " +
            "inner join t_product p on p.product_id = si.product_id " +
            "inner join t_product_price pp on pp.product_id = si.product_id " +
            "where shipment_id = 9 and pp.created_at = (SELECT MAX(pp2.created_at) " +
            "                     FROM t_product_price pp2 " +
            "                     WHERE pp2.product_id = pp.product_id);",nativeQuery = true)
    List<Object[]> getProductsByShipmentId(Long shipmentId);
}

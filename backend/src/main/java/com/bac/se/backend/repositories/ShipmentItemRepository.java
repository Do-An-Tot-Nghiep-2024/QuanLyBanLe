package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.ShipmentItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, ShipmentItemKey> {

    // check if shipment item is expired
//    @Query(value = "select p from ShipmentItem p where p.createdAt < :createdAt")
//    Object[] isExpired(ShipmentItemKey key);

    @Query(value = "select s.shipment_id from t_shipment s " +
            "inner join t_shipment_item si on si.shipment_id = s.shipment_id " +
            "inner join t_stock so on  so.stock_id = si.stock_id " +
            "where si.product_id = ?1 and (so.quantity - so.sold_quantity) > 0", nativeQuery = true)
    List<Object[]> getShipmentItemByProduct(Long productId);

    @Query(value = "select p.name, si.quantity," +
            " s.sold_quantity,s.failed_quantity," +
            " si.quantity - s.sold_quantity + s.failed_quantity," +
            " si.mxp, si.exp, pp.original_price, pp.original_price * si.quantity as total,u.name " +
            "from t_shipment_item si " +
            "inner join t_product p on p.product_id = si.product_id " +
            "inner join t_unit u on u.unit_id = p.unit_id " +
            "inner join t_product_price pp on pp.product_id = si.product_id " +
            "left join t_stock s on s.stock_id = si.stock_id " +
            "where si.shipment_id = ?1 and pp.created_at = (SELECT MAX(pp2.created_at) " +
            "                     FROM t_product_price pp2 " +
            "                     WHERE pp2.product_id = pp.product_id)", nativeQuery = true)
    List<Object[]> getProductsByShipmentId(Long shipmentId);


    @Query(value = "SELECT  " +
            "s.stock_id, s.quantity, s.sold_quantity " +
            "FROM " +
            "    t_shipment_item si " +
            "        INNER JOIN " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "WHERE " +
            "    si.shipment_id = :shipmentId " +
            "AND si.product_id = :productId", nativeQuery = true)
    List<Object[]> getStockByShipmentItem(
            @Param("shipmentId") Long shipmentId,
            @Param("productId") Long productId,
            Pageable pageable);
}

package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.ShipmentItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ShipmentItemRepository extends JpaRepository<ShipmentItem, ShipmentItemKey> {

    @Query(value = "select s.shipment_id,si.discount from t_shipment s " +
            "inner join t_shipment_item si on si.shipment_id = s.shipment_id " +
            "inner join t_stock so on  so.stock_id = si.stock_id " +
            "where si.product_id = ?1 and (so.quantity - so.sold_quantity) > 0", nativeQuery = true)
    List<Object[]> getShipmentItemByProduct(Long productId);

    @Query(value = "SELECT si.shipment_id AS shipmentId, sup.name AS supplier, p.name AS product, " +
            "si.mxp, si.exp," +
            "s.sold_quantity AS soldQuantity, " +
            "(s.quantity - s.sold_quantity) AS availableQuantity, u.name AS unit " +
            "FROM t_shipment_item si " +
            "INNER JOIN t_product p ON p.product_id = si.product_id " +
            "INNER JOIN t_unit u ON u.unit_id = p.unit_id " +
            "INNER JOIN t_shipment ship ON ship.shipment_id = si.shipment_id " +
            "INNER JOIN t_supplier sup ON sup.supplier_id = ship.supplier_id " +
            "INNER JOIN t_stock s ON s.stock_id = si.stock_id ORDER BY shipmentId DESC",
            nativeQuery = true)
    List<Object[]> geProductInShipment();

    @Query(value = "select p.name, si.quantity," +
            " si.mxp, si.exp, pp.original_price, pp.original_price * si.quantity as total,u.name " +
            "from t_shipment_item si " +
            "inner join t_product p on p.product_id = si.product_id " +
            "inner join t_unit u on u.unit_id = p.unit_id " +
            "inner join t_product_price pp on pp.product_id = si.product_id " +
            "left join t_stock s on s.stock_id = si.stock_id " +
            "where si.shipment_id = ?1 and pp.created_at = (SELECT MAX(pp2.created_at) " +
            "                     FROM t_product_price pp2 " +
            "                     WHERE pp2.product_id = pp.product_id)", nativeQuery = true)
    List<Object[]> getProductsInImportInvoice(Long shipmentId);


}

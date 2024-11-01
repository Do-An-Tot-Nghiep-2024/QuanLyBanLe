package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Stock;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StockRepository extends JpaRepository<Stock, Long> {

    @Query(value = "select sum(sold_quantity) from t_stock", nativeQuery = true)
    int getTotalQuantitySold();


    @Query(value = "SELECT s.stock_id, s.quantity,s.sold_quantity FROM t_shipment_item si INNER JOIN t_stock s on s.stock_id = si.stock_id " +
            "WHERE si.shipment_id =:shipmentId AND si.product_id =:productId", nativeQuery = true)
    List<Object[]> getAvailableQuantityStock(
            @Param("shipmentId") Long shipmentId
            , @Param("productId") Long productId
            , Pageable pageable);

}

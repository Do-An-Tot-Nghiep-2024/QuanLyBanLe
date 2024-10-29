package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StockRepository extends JpaRepository<Stock, Long> {
//    default Optional<Stock> findStockByProductId(Long productId) {
//        return null;
//    }

    @Query(value = "select sum(sold_quantity) from t_stock", nativeQuery = true)
    int getTotalQuantitySold();


//    @Query(value = "select s.stock_id, p.name, sold_quantity, quantity - sold_quantity as total " +
//            "from t_stock s " +
//            "inner join t_shipment ship on s.shipment_id = ship.shipment_id " +
//            "where p.is_active = 1 order by s.sold_quantity desc", nativeQuery = true)
//    Page<Object[]> getStocksByShipment(Pageable pageable);

}

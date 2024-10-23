package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Long> {
    Optional<Stock> findStockByProductId(Long productId);

    @Query(value = "select sum(sold_quantity) from t_stock",nativeQuery = true)
    int getTotalQuantitySold();



    @Query(value = "select s.stock_id, p.name, sold_quantity, quantity - sold_quantity as total " +
            "from t_stock s " +
            "inner join t_product p on s.product_id = p.product_id order by s.sold_quantity desc",nativeQuery = true)
    Page<Object[]> getStocksByProduct(Pageable pageable);

}

package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Long> {
    Optional<Stock> findStockByProductId(Long productId);

    @Query(value = "select sum(sold_quantity) from t_stock",nativeQuery = true)
    int getTotalQuantitySold();
}

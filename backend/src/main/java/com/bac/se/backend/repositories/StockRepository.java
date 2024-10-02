package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock,Long> {
    Optional<Stock> findStockByProductId(Long productId);
}

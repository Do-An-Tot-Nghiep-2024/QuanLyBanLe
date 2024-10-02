package com.bac.se.backend.repositories;

import com.bac.se.backend.models.ProductPrice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {

    @Query("SELECT p.originalPrice, p.price,p.discountPrice " +
            "FROM ProductPrice p " +
            "WHERE p.product.id = :productId " +
            "ORDER BY p.createdAt DESC ")
    List<Object[]> getProductPriceLatest(@Param("productId") Long productId, Pageable pageable);

}

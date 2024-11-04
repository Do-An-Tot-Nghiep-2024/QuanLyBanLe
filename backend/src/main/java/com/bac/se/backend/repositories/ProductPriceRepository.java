package com.bac.se.backend.repositories;

import com.bac.se.backend.models.ProductPrice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long> {
    @Query(value = "SELECT " +
            "    pp.product_price_id, " +
            "    pp.original_price, " +
            "    pp.price AS latest_price, " +
            "    CASE " +
            "        WHEN pp.is_promotion = 1 " +
            "             AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date AND pr.order_limit > 0 " +
            "             AND pr.promotion_type_id = 4 " +
            "        THEN pp.discount_price " +
            "        ELSE 0 " +
            "    END AS discount " +
            "FROM " +
            "    t_product p " +
            "JOIN " +
            "    t_product_price pp ON p.product_id = pp.product_id " +
            "                       AND pp.created_at = ( " +
            "                           SELECT MAX(sub_pp.created_at) " +
            "                           FROM t_product_price sub_pp " +
            "                           WHERE sub_pp.product_id = p.product_id " +
            "                       ) " +
            "LEFT JOIN " +
            "    t_promotion pr ON p.promotion_id = pr.promotion_id " +
            "                   AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date " +
            "                   AND pr.promotion_type_id = 4 " +
            "                   AND pr.order_limit > 0 " +
            "WHERE " +
            "    p.is_active = 1 AND p.product_id = :productId",nativeQuery = true)
    List<Object[]> getProductPriceLatest(Long productId, Pageable pageable);



    @Query("select p.originalPrice,p.price,p.createdAt from ProductPrice p where p.product.id = :productId")
    List<Object[]> getProductPricesByProduct(Long productId);


}

package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Promotion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion,Long> {

    @Query(value = "SELECT   " +
            "    p.promotion_id, o.min_order_value, o.discount_percent " +
            "FROM  " +
            "    t_promotion p  " +
            "        LEFT JOIN  " +
            "    t_order_promotion o ON o.promotion_id = p.promotion_id  " +
            "WHERE  " +
            "    p.scope = 'ORDER'  " +
            "        AND p.end_date > CURRENT_DATE  " +
            "        AND p.order_limit > 0  " +
            "ORDER BY p.promotion_id DESC",
            nativeQuery = true)
    List<Object[]> getPromotionOrderLatest(Pageable pageable);


    @Query(value = "SELECT pro.promotion_id FROM t_product p  " +
            "INNER JOIN t_promotion pro ON pro.promotion_id = p.promotion_id AND pro.end_date > CURRENT_DATE AND pro.order_limit > 0 " +
            "WHERE p.product_id = ?1 ORDER BY pro.promotion_id DESC",nativeQuery = true)
    List<Object[]> existPromotionByProduct(Long productId,Pageable pageable);


}

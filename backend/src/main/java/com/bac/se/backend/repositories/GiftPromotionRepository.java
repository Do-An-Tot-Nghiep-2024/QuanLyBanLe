package com.bac.se.backend.repositories;

import com.bac.se.backend.models.GiftPromotion;
import com.bac.se.backend.models.Promotion;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GiftPromotionRepository extends JpaRepository<GiftPromotion,Long> {

    Optional<GiftPromotion> findByPromotion(Promotion promotion);

    @Query(value = "SELECT  " +
            "    gf.buy_quantity, " +
            "    gf.gift_quantity, " +
            "    (SELECT  " +
            "            p1.name " +
            "        FROM " +
            "            t_product p1 " +
            "        WHERE " +
            "            p1.product_id = gf.gift_product_id) AS gift_product_name " +
            "FROM " +
            "    t_product p " +
            "        INNER JOIN " +
            "    t_promotion pr ON pr.promotion_id = p.promotion_id " +
            "        AND pr.promotion_type_id = 3 " +
            "        AND pr.end_date > CURRENT_DATE " +
            "        AND pr.order_limit > 0 " +
            "        INNER JOIN " +
            "    t_gift_promotion gf ON gf.promotion_id = pr.promotion_id " +
            "WHERE p.product_id = ?1",nativeQuery = true)
    List<Object[]> getGiftPromotionByProduct(Long productId, Pageable pageable);
}

package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Promotion;
import com.bac.se.backend.models.QuantityPromotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuantityPromotionRepository extends JpaRepository<QuantityPromotion,Long> {
    Optional<QuantityPromotion> findByPromotion(Promotion promotion);
}

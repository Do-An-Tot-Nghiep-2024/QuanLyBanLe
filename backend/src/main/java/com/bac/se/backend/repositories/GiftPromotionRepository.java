package com.bac.se.backend.repositories;

import com.bac.se.backend.models.GiftPromotion;
import com.bac.se.backend.models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GiftPromotionRepository extends JpaRepository<GiftPromotion,Long> {

    Optional<GiftPromotion> findByPromotion(Promotion promotion);
}

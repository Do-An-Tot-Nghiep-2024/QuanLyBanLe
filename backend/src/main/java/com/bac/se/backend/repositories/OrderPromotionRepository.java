package com.bac.se.backend.repositories;

import com.bac.se.backend.models.OrderPromotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderPromotionRepository extends JpaRepository<OrderPromotion,Long> {
}

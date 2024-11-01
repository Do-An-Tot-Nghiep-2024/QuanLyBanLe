package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion,Long> {
}

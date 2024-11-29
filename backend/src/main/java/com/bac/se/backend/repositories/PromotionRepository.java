package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion,Long> {

    @Query(value = "SELECT p.id,p.minOrderValue, p.percentage,p.orderLimit,p.endDate " +
            "FROM Promotion p WHERE p.isActive = true " +
            "ORDER BY p.id DESC")
    List<Object[]> getLatestPromotion(Pageable pageable);


    @Query(value = "SELECT p.id, p.name, p.description, p.startDate, " +
            "p.endDate, p.orderLimit, p.minOrderValue, p.percentage, p.isActive " +
            "FROM Promotion p WHERE p.isActive = true " +
            "ORDER BY p.id DESC")
    Page<Object[]> getPromotions(Pageable pageable);



}

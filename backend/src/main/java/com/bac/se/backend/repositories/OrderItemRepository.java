package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.OrderItemKey;
import com.bac.se.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemKey> {

    @Query(value = "select sum(total_price) from t_order_item",nativeQuery = true)
    double getTotalPriceOrder();

}

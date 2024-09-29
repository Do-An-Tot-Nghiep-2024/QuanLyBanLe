package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.OrderItemKey;
import com.bac.se.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemKey> {

}

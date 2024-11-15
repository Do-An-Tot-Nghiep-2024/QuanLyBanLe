package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.OrderItemKey;
import com.bac.se.backend.models.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemKey> {

    @Query(value = "select sum(oi.amount) from t_order_item oi " +
            "inner join t_order o on o.order_id = oi.order_id where o.order_status = 'COMPLETED'",nativeQuery = true)
    double getTotalSales();

    @Query(value = "select p.name, SUM(oi.total_price) from t_order_item oi " +
            "inner join t_product p on p.product_id = oi.product_id " +
            "group by oi.product_id ",nativeQuery = true)
    List<Object[]> salesStatisticsByProduct();


    @Query(value = "select e.name, sum(oi.total_price) from t_order o " +
            "inner join t_order_item oi on oi.order_id = o.order_id " +
            "inner join t_employee e on e.employee_id = o.employee_id " +
            "group by o.employee_id", nativeQuery = true)
    List<Object[]> salesStatisticsByEmployee();


    @Query(value = "SELECT p.name,SUM(oi.quantity),pp.price,SUM(oi.amount) FROM t_order_item oi " +
            "INNER JOIN t_product p ON p.product_id = oi.product_id " +
            "INNER JOIN t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE oi.order_id = ?1 GROUP BY p.name,pp.price",nativeQuery = true)
    List<Object[]> getProductInOrderItem(Long orderId);






}

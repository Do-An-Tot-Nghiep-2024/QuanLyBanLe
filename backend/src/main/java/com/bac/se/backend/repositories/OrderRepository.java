package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(value = "select o.order_id, e.name as emp,sum(oi.total_price) as total, o.order_status,o.payment_type,o.created_at " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "where customer_id = :id " +
            "group by oi.order_id", nativeQuery = true)
    Page<Object[]> getOrdersByCustomer(Long id, Pageable pageable);


    @Query(value = "select o.order_id, e.name as emp,sum(oi.total_price) as total, o.order_status,o.payment_type,o.created_at " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "where employee_id = :id " +
            "group by oi.order_id", nativeQuery = true)
    Page<Object[]> getOrdersByEmployee(Long id, Pageable pageable);

    @Query(value = "select o.order_id, e.name as emp, sum(oi.total_price) as total, o.order_status, o.payment_type, o.created_at " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "where e.employee_id = :id and o.created_at between :fromDate and :toDate " +
            "group by o.order_id", nativeQuery = true)
    Page<Object[]> getOrdersEmployeeByDate(
            @Param("id") Long id, Pageable pageable,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate);



    // get order item by order id
    @Query(value = "SELECT " +
            "    CASE " +
            "        WHEN pp.discount_price = 0 THEN pp.price " +
            "        ELSE pp.discount_price " +
            "    END AS price, " +
            "    p.name, " +
            "    oi.quantity, " +
            "    oi.quantity * (" +
            "        CASE " +
            "            WHEN pp.discount_price = 0 THEN pp.price " +
            "            ELSE pp.discount_price " +
            "        END " +
            "    ) AS total_price " +
            "FROM t_order_item oi " +
            "JOIN t_order o ON oi.order_id = o.order_id " +
            "JOIN t_product p ON p.product_id = oi.product_id " +
            "JOIN t_product_price pp ON pp.product_id = p.product_id " +
            "WHERE oi.order_id = ?1 " +
            "  AND pp.created_at = (" +
            "      SELECT MAX(p1.created_at) " +
            "      FROM t_product_price p1 " +
            "      WHERE p1.product_id = p.product_id " +
            "  );", nativeQuery = true)
    List<Object[]> getOrderItemByOrderId(Long orderId);


    @Query(value = "select e.name,e.phone from t_order o " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "where o.order_id = :orderId;", nativeQuery = true)
    List<Object[]> getEmployeeByOrderId(Long orderId);

    @Query(value = "select count(*) from t_order where order_status = 'COMPLETED'",nativeQuery = true)
    long getTotalQuantityOrder();
}

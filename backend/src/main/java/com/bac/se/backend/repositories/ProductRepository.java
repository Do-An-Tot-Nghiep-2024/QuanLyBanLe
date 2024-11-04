package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(value = "SELECT   " +
            "    p.product_id,  " +
            "    p.name,  " +
            "    p.image,  " +
            "    c.name as category,  " +
            "    u.name as unit, pro" +
            ".name,  " +
            "    pp.price AS latest_price,  " +
            "    CASE  " +
            "        WHEN pp.is_promotion = 1   " +
            "             AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date AND pr.order_limit > 0  " +
            "             AND pr.promotion_type_id = 4  " +
            "        THEN pp.discount_price  " +
            "        ELSE 0  " +
            "    END AS discount  " +
            "FROM   " +
            "    t_product p  " +
            "INNER JOIN  " +
            "    t_category c on c.category_id = p.category_id  " +
            "INNER JOIN  " +
            "    t_unit u on p.unit_id = u.unit_id  " +
            "LEFT JOIN t_promotion pro ON p.promotion_id = pro.promotion_id AND pro.end_date > CURRENT_DATE AND pro.order_limit > 0 " +
            "JOIN   " +
            "    t_product_price pp ON p.product_id = pp.product_id   " +
            "                       AND pp.created_at = (  " +
            "                           SELECT MAX(sub_pp.created_at)  " +
            "                           FROM t_product_price sub_pp  " +
            "                           WHERE sub_pp.product_id = p.product_id  " +
            "                       )  " +
            "LEFT JOIN   " +
            "    t_promotion pr ON p.promotion_id = pr.promotion_id   " +
            "                   AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date  " +
            "                   AND pr.promotion_type_id = 4  " +
            "                   AND pr.order_limit > 0  " +
            "WHERE   " +
            "    p.is_active = 1",nativeQuery = true)
    Page<Object[]> getProducts(Pageable pageable);



    @Query(value = "select count(*) from t_product where is_active = 0", nativeQuery = true)
    long getTotalQuantityProduct();


    @Query(value = "select p.id, p.name from Product p where p.supplier.id = ?1 and p.isActive = true")
    List<Object[]> getProductsBySupplier(Long supplierId);

    @Query(value = "SELECT   " +
            "    p.product_id,  " +
            "    p.name,  " +
            "    p.image,  " +
            "    c.name as category,  " +
            "    u.name as unit, pro" +
            ".name,  " +
            "    pp.price AS latest_price,  " +
            "    CASE  " +
            "        WHEN pp.is_promotion = 1   " +
            "             AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date AND pr.order_limit > 0  " +
            "             AND pr.promotion_type_id = 4  " +
            "        THEN pp.discount_price  " +
            "        ELSE 0  " +
            "    END AS discount  " +
            "FROM   " +
            "    t_product p  " +
            "INNER JOIN  " +
            "    t_category c on c.category_id = p.category_id  " +
            "INNER JOIN  " +
            "    t_unit u on p.unit_id = u.unit_id  " +
            "LEFT JOIN t_promotion pro ON p.promotion_id = pro.promotion_id AND pro.end_date > CURRENT_DATE AND pro.order_limit > 0 " +
            "JOIN   " +
            "    t_product_price pp ON p.product_id = pp.product_id   " +
            "                       AND pp.created_at = (  " +
            "                           SELECT MAX(sub_pp.created_at)  " +
            "                           FROM t_product_price sub_pp  " +
            "                           WHERE sub_pp.product_id = p.product_id  " +
            "                       )  " +
            "LEFT JOIN   " +
            "    t_promotion pr ON p.promotion_id = pr.promotion_id   " +
            "                   AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date  " +
            "                   AND pr.promotion_type_id = 4  " +
            "                   AND pr.order_limit > 0  " +
            "WHERE  p.is_active = 1 AND p.category_id = ?1", nativeQuery = true)
    List<Object[]> getProductsByCategory(Long categoryId);


    @Query(value = "SELECT " +
            "    p.name, SUM(s.sold_quantity) AS total_sold_quantity " +
            "FROM " +
            "    t_order o" +
            "        INNER JOIN " +
            "    t_order_item oi ON o.order_id = oi.order_id " +
            "        INNER JOIN " +
            "    t_product p ON oi.product_id = p.product_id " +
            "        INNER JOIN" +
            "    t_shipment_item si ON si.product_id = p.product_id " +
            "        INNER JOIN " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "WHERE " +
            "    o.created_at BETWEEN :fromDate AND :toDate " +
            "GROUP BY p.product_id " +
            "ORDER BY total_sold_quantity DESC", nativeQuery = true)
    Page<Object[]> getBestSellingProducts(Pageable pageable,
                                          @Param("fromDate") Date fromDate,
                                          @Param("toDate") Date toDate);


    @Query(value = "SELECT " +
            "    p.product_id," +
            "    p.name,      " +
            "    p.image, pro.name,     " +
            "    pp.price AS latest_price,      " +
            "    CASE      " +
            "        WHEN pp.is_promotion = 1       " +
            "             AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date AND pr.order_limit > 0      " +
            "             AND pr.promotion_type_id = 4      " +
            "        THEN pp.discount_price      " +
            "        ELSE 0      " +
            "    END AS discount      " +
            "FROM       " +
            "    t_product p      " +
            "JOIN       " +
            "    t_product_price pp ON p.product_id = pp.product_id       " +
            "                       AND pp.created_at = (      " +
            "                           SELECT MAX(sub_pp.created_at)      " +
            "                           FROM t_product_price sub_pp      " +
            "                           WHERE sub_pp.product_id = p.product_id      " +
            "                       )      " +
            "LEFT JOIN t_promotion pro ON p.promotion_id = pro.promotion_id AND pro.end_date > CURRENT_DATE AND pro.order_limit > 0 " +
            "LEFT JOIN       " +
            "    t_promotion pr ON p.promotion_id = pr.promotion_id       " +
            "                   AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date      " +
            "                   AND pr.promotion_type_id = 4      " +
            "                   AND pr.order_limit > 0      " +
            "WHERE       " +
            "    p.is_active = 1 " +
            "ORDER BY p.name", nativeQuery = true)
    Page<Object[]> getProductsMobile(Pageable pageable);


    @Query(value = "SELECT " +
            "    p.product_id, " +
            "    p.name,      " +
            "    p.image, pro.name, " +
            "    pp.price AS latest_price,      " +
            "    CASE      " +
            "        WHEN pp.is_promotion = 1       " +
            "             AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date AND pr.order_limit > 0      " +
            "             AND pr.promotion_type_id = 4      " +
            "        THEN pp.discount_price      " +
            "        ELSE 0      " +
            "    END AS discount      " +
            "FROM       " +
            "    t_product p      " +
            "LEFT JOIN t_promotion pro ON p.promotion_id = pro.promotion_id AND pro.end_date > CURRENT_DATE AND pro.order_limit > 0 " +
            "JOIN       " +
            "    t_product_price pp ON p.product_id = pp.product_id       " +
            "                       AND pp.created_at = (      " +
            "                           SELECT MAX(sub_pp.created_at)      " +
            "                           FROM t_product_price sub_pp      " +
            "                           WHERE sub_pp.product_id = p.product_id      " +
            "                       )      " +
            "LEFT JOIN       " +
            "    t_promotion pr ON p.promotion_id = pr.promotion_id       " +
            "                   AND CURRENT_DATE BETWEEN pr.start_date AND pr.end_date      " +
            "                   AND pr.promotion_type_id = 4      " +
            "                   AND pr.order_limit > 0      " +
            "WHERE       " +
            "    p.is_active = 1 AND p.category_id = ?1 " +
            "ORDER BY p.name", nativeQuery = true)
    Page<Object[]> getProductsMobileByCategory(Long categoryId,Pageable pageable);

}

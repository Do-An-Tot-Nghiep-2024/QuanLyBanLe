package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.id, p.name, p.image, c.name, s.name, " +
            "COALESCE(pp.originalPrice, 0) as originalPrice, " +
            "COALESCE(pp.price, 0) as price, " +
            "COALESCE(pp.discountPrice, 0) as discountPrice " +
            "FROM Product p " +
            "JOIN p.category c " +
            "JOIN p.supplier s " +
            "LEFT JOIN ProductPrice pp ON pp.product.id = p.id " +
            "AND pp.createdAt = (SELECT MAX(p1.createdAt) FROM ProductPrice p1 WHERE p1.product.id = p.id) " +
            "WHERE p.isActive = true order by p.name asc")
    Page<Object[]> getProducts(Pageable pageable);


    @Query(value = "select count(*) from t_product where is_active = 0",nativeQuery = true)
    long getTotalQuantityProduct();

}

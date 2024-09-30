package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.id, p.name, p.image,c.name,s.name, pp.originalPrice, pp.price, pp.discountPrice " +
            "FROM Product p " +
            "JOIN p.productPrice pp " +
            "JOIN p.category c " +
            "JOIN p.supplier s")
    Page<Object[]> getProducts(Pageable pageable);


}

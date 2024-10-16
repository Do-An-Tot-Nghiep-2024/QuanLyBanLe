package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    @Query("select s.id, s.name, s.phone, s.email, s.address from Supplier s where s.isActive = true order by s.name asc")
    Page<Object[]> getSuppliers(Pageable pageable);

    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}

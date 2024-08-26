package bac.dev.se.backend.controllers;

import bac.dev.se.backend.models.Supplier;
import bac.dev.se.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierRepository supplierRepository;

    @GetMapping
    public List<Supplier> getSuppliers(){
        System.out.println("Get all suppliers...");
        return supplierRepository.findAll();
    }
    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable("id") Long id){
        return supplierRepository.findById(id).orElseThrow(() -> new RuntimeException("Supplier not found"));
    }
    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier){
        return supplierRepository.save(supplier);
    }

    @DeleteMapping("/{id}")
    public String deleteSupplier(@PathVariable("id") Long id){
        supplierRepository.deleteById(id);
        
        return "Supplier deleted";
    }
}

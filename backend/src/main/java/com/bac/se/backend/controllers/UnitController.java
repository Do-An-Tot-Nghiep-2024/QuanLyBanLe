package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Unit;
import com.bac.se.backend.payload.response.UnitResponse;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.services.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/units")
@RequiredArgsConstructor
public class UnitController {
    private final UnitService unitService;
    final String REQUEST_SUCCESS = "success";

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<UnitResponse>>> getUnits() {
        try {
            return ResponseEntity
                    .ok()
                    .body(new ApiResponse<>(REQUEST_SUCCESS, unitService.getUnits()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<UnitResponse>> getUnit(@PathVariable("id") Long id) {
        try {
            return ResponseEntity
                    .ok()
                    .body(new ApiResponse<>(REQUEST_SUCCESS, unitService.getUnitById(id)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<UnitResponse>> createUnit(@RequestBody Unit unit) {
        try {
            return ResponseEntity
                    .status(201)
                    .body(new ApiResponse<>(REQUEST_SUCCESS, unitService.createUnit(unit)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(400)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<Long>> deleteUnit(@PathVariable("id") Long id) {
        try {
            unitService.deleteUnit(id);
            return ResponseEntity.ok()
                    .body(new ApiResponse<>(REQUEST_SUCCESS, id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<UnitResponse>> updateUnit(@PathVariable("id") Long id, @RequestBody Unit unit) {
        try {
            return ResponseEntity
                    .status(201)
                    .body(new ApiResponse<>(REQUEST_SUCCESS, unitService.updateUnit(id, unit)));
        } catch (BadRequestUserException e) {
            return ResponseEntity
                    .status(400)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity
                    .status(404)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

}

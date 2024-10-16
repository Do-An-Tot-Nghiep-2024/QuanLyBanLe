package com.bac.se.backend.controllers;

import com.bac.se.backend.exceptions.AlreadyExistsException;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.payload.request.EmployeeRequest;
import com.bac.se.backend.payload.response.common.ApiResponse;
import com.bac.se.backend.payload.response.employee.EmployeePageResponse;
import com.bac.se.backend.payload.response.employee.EmployeeResponse;
import com.bac.se.backend.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Slf4j
public class EmployeeController {
    static final String SUCCESS = "success";
    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<EmployeePageResponse>> getEmployees(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        try {
            var employees = employeeService.getEmployees(pageNumber, pageSize);
            log.info("get employees success");
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employees));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE') or hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployee(@PathVariable("id") Long id) {
        try {
            EmployeeResponse employee = employeeService.getEmployee(id);
            log.info("get employee success");
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employee));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@RequestBody EmployeeRequest employeeRequest) {
        try {
            EmployeeResponse employee = employeeService.createEmployee(employeeRequest);
            log.info("create employee success");
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employee));
        } catch (BadRequestUserException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<Long>> deleteEmployee(@PathVariable("id") Long id) {
        try {
            employeeService.deleteEmployee(id);
            log.info("delete employee success");
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable("id") Long id, @RequestBody EmployeeRequest employeeRequest) {
        try {
            EmployeeResponse employee = employeeService.updateEmployee(id, employeeRequest);
            log.info("update employee success");
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employee));
        } catch (BadRequestUserException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }


    @GetMapping("/export")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<List<EmployeeResponse>>> exportEmployees() {
        try {
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employeeService.exportEmployees()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<ApiResponse<String>> importEmployees(@RequestBody List<EmployeeRequest> employeeRequestList) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(SUCCESS, employeeService.importEmployees(employeeRequestList)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}

package com.bac.se.backend.services.impl;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.models.Unit;
import com.bac.se.backend.payload.response.UnitResponse;
import com.bac.se.backend.repositories.UnitRepository;
import com.bac.se.backend.services.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;

    @Override
    public List<UnitResponse> getUnits() {
        return unitRepository.findAll().stream()
                .map(u -> new UnitResponse(u.getId(), u.getName())).toList();
    }

    @Override
    public UnitResponse getUnitById(Long id) {
        return unitRepository.findById(id).map(u -> new UnitResponse(u.getId(), u.getName()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn vị tính với mã là : " + id));
    }

    @Override
    public UnitResponse createUnit(Unit unit) throws BadRequestUserException {
        if (unit.getName() == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        ;
        return new UnitResponse(unitRepository.save(unit).getId(), unit.getName());
    }

    @Override
    public void deleteUnit(Long id) {
        var present = unitRepository.findById(id);
        if (present.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy đơn vị tính với mã là : " + id);
        }
        unitRepository.deleteById(id);
    }

    @Override
    public UnitResponse updateUnit(Long id,Unit unit) throws BadRequestUserException {
        var findUnit =  unitRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Không tìm thấy đơn vị tính với mã là : " + id)
        );
        if (unit.getName() == null) {
            throw new BadRequestUserException("Vui lòng nhập đầy đủ thông tin");
        }
        findUnit.setName(unit.getName());
        return new UnitResponse(unitRepository.save(findUnit).getId(), unit.getName());
    }
}

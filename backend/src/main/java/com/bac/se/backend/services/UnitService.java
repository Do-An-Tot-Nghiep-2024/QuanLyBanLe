package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.models.Unit;
import com.bac.se.backend.payload.response.UnitResponse;

import java.util.List;

public interface UnitService {

    List<UnitResponse> getUnits();

    UnitResponse getUnitById(Long id);

    UnitResponse createUnit(Unit unit) throws BadRequestUserException;

    String deleteUnit(Long id);

    UnitResponse updateUnit(Long id,Unit unit) throws BadRequestUserException;
}

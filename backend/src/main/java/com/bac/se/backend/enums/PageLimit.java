package com.bac.se.backend.enums;

import lombok.Getter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@Getter
public enum PageLimit {

    ONLY(PageRequest.of(0, 1)),
    DEFAULT(PageRequest.of(0, 10));

    private final Pageable pageable;

    PageLimit(Pageable pageable) {
        this.pageable = pageable;
    }
}

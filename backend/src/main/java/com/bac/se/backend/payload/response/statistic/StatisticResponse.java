package com.bac.se.backend.payload.response.statistic;

import java.math.BigDecimal;

public record StatisticResponse(String name, BigDecimal total) {
}

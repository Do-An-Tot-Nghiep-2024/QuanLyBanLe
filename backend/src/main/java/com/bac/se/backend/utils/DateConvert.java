package com.bac.se.backend.utils;

import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.response.statistic.SaleAndProfitResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class DateConvert {

//    private static final String DEFAULT_FROM_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
//            .format(LocalDate.now().minusMonths(6));

    private static final String DEFAULT_TO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().plusDays(1));
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private String createDate(LocalDate date){
        return DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
                .format(date);
    }

    // 6 months
    public DateRequest convertDateRequest(String fromDate, String toDate) throws ParseException {
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(createDate(LocalDate.now().minusMonths(3)));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }

    public DateRequest convertMothRequest(String fromDate, String toDate) throws ParseException {
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(createDate(LocalDate.now().minusMonths(1)));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }

    public DateRequest convertCurrentDateRequest(String fromDate, String toDate) throws ParseException {
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
                .format(LocalDate.now()));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }

    public DateRequest generateDateInWeek(String toDate) throws ParseException {
        if(toDate == null){
           Date from = dateFormat.parse(createDate(LocalDate.now().minusWeeks(1)));
           Date to = dateFormat.parse(DEFAULT_TO_DATE);
           return new DateRequest(from, to);
        }
        LocalDate parsedToDate = LocalDate.parse(toDate, DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH));
        LocalDate fromLocalDate = parsedToDate.minusDays(6); // Subtract 7 days
        Date fromDate = dateFormat.parse(createDate(fromLocalDate));
        Date toDay = dateFormat.parse(createDate(parsedToDate.plusDays(1)));
        return new DateRequest(fromDate, toDay);
    }
    public Map<String, SaleAndProfitResponse> generateDateInWeekMap(String toDate) throws ParseException {
// Get the DateRequest object with fromDate and toDate
        DateRequest dateRequest = generateDateInWeek(toDate);

        // Convert Date to LocalDate for easier manipulation
        LocalDate fromLocalDate = dateRequest.fromDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate toLocalDate = dateRequest.toDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        // Initialize the map
        Map<String, SaleAndProfitResponse> dateMap = new LinkedHashMap<>();
        // Populate the map with dates between fromDate and toDate
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy", Locale.ENGLISH);
        while (!fromLocalDate.isAfter(toLocalDate)) {
            String formattedDate = fromLocalDate.format(formatter);
            dateMap.put(formattedDate, new SaleAndProfitResponse(
                    formattedDate,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO
            )); // Add the key as the formatted date and value as null
            // Move to the next date
            fromLocalDate = fromLocalDate.plusDays(1);
            if(fromLocalDate.equals(toLocalDate)){
                break;
            }
        }

        return dateMap;
    }
}

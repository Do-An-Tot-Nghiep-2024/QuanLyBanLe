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
import java.util.*;

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

    public Date formatDateYYYYMMDD(Date date) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // Format the date to string
        String formattedDateStr = formatter.format(date);
        // Parse the string back to a Date object
        return formatter.parse(formattedDateStr);
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

    public DateRequest generateDayInCurrentWeek(int next) throws ParseException {
        Calendar calendar = Calendar.getInstance();

        // Get today's date
        Date today = calendar.getTime();

        // Reset calendar to today and add 'next' days
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_MONTH, next);
        Date modifiedToDate = formatDateYYYYMMDD(calendar.getTime());

        // Ensure toDate doesn't exceed the current date
        Date toDate = today.before(modifiedToDate) ? today : modifiedToDate;

        // Calculate Monday of the current week
        int currentDay = calendar.get(Calendar.DAY_OF_WEEK); // Sunday = 1, Monday = 2, ..., Saturday = 7
        int daysToMonday = (currentDay == Calendar.SUNDAY) ? -6 : Calendar.MONDAY - currentDay;
        calendar.add(Calendar.DAY_OF_MONTH, daysToMonday);
        Date fromDate = formatDateYYYYMMDD(calendar.getTime());

        // Return the DateRequest object
        return new DateRequest(fromDate, formatDateYYYYMMDD(toDate));
    }


    public Map<String, SaleAndProfitResponse> generateDateInWeekMap(int next) throws ParseException {
// Get the DateRequest object with fromDate and toDate
        DateRequest dateRequest = generateDayInCurrentWeek(next);

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
//            if(fromLocalDate.equals(toLocalDate)){
//                break;
//            }
        }

        return dateMap;
    }
}

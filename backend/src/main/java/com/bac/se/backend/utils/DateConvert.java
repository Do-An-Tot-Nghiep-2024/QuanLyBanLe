package com.bac.se.backend.utils;

import com.bac.se.backend.payload.request.DateRequest;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

@Service
public class DateConvert {

//    private static final String DEFAULT_FROM_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
//            .format(LocalDate.now().minusMonths(6));

    private static final String DEFAULT_TO_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
            .format(LocalDate.now().plusDays(1));

    String createFromDate(long month){
        return DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
                .format(LocalDate.now().minusMonths(month));
    }

    // 6 months
    public DateRequest convertDateRequest(String fromDate, String toDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(createFromDate(6));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }

    public DateRequest convertMothRequest(String fromDate, String toDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(createFromDate(1));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }

    public DateRequest convertCurrentDateRequest(String fromDate, String toDate) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date from = fromDate != null ? dateFormat.parse(fromDate) : dateFormat.parse(DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.ENGLISH)
                .format(LocalDate.now()));
        Date to = toDate != null ? dateFormat.parse(toDate) : dateFormat.parse(DEFAULT_TO_DATE);
        return new DateRequest(from, to);
    }


}

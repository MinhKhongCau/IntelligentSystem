package com.intelligent.missingperson.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.intelligent.missingperson.repository.MissingDocumentRepository;
import com.intelligent.missingperson.repository.AccountRepository;
import com.intelligent.missingperson.repository.VolunteerReportRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private MissingDocumentRepository missingDocumentRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VolunteerReportRepository volunteerReportRepository;

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        try {
            long missingCount = missingDocumentRepository.count();
            long userCount = accountRepository.count();
            long reportCount = volunteerReportRepository.count();

            Map<String, Long> result = new HashMap<>();
            result.put("missingCount", missingCount);
            result.put("userCount", userCount);
            result.put("reportCount", reportCount);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get statistics: " + e.getMessage());
        }
    }

    // Return daily counts for users (created date)
    @GetMapping("/users/daily")
    public ResponseEntity<?> getUsersDaily() {
        try {
            java.util.List<Object[]> rows = accountRepository.countGroupedByCreatedDate();
            java.util.List<java.util.Map<String, Object>> out = new java.util.ArrayList<>();
            for (Object[] r : rows) {
                java.util.Map<String, Object> m = new java.util.HashMap<>();
                m.put("date", r[0] != null ? r[0].toString() : null);
                m.put("count", ((Number) r[1]).longValue());
                out.add(m);
            }
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get users daily: " + e.getMessage());
        }
    }

    // Return daily counts for missing documents (report_date)
    @GetMapping("/missing/daily")
    public ResponseEntity<?> getMissingDaily() {
        try {
            java.util.List<Object[]> rows = missingDocumentRepository.countGroupedByReportDate();
            java.util.List<java.util.Map<String, Object>> out = new java.util.ArrayList<>();
            for (Object[] r : rows) {
                java.util.Map<String, Object> m = new java.util.HashMap<>();
                m.put("date", r[0] != null ? r[0].toString() : null);
                m.put("count", ((Number) r[1]).longValue());
                out.add(m);
            }
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get missing daily: " + e.getMessage());
        }
    }

    // Return daily counts for volunteer reports (report_time)
    @GetMapping("/reports/daily")
    public ResponseEntity<?> getReportsDaily() {
        try {
            java.util.List<Object[]> rows = volunteerReportRepository.countGroupedByReportDate();
            java.util.List<java.util.Map<String, Object>> out = new java.util.ArrayList<>();
            for (Object[] r : rows) {
                java.util.Map<String, Object> m = new java.util.HashMap<>();
                m.put("date", r[0] != null ? r[0].toString() : null);
                m.put("count", ((Number) r[1]).longValue());
                out.add(m);
            }
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to get reports daily: " + e.getMessage());
        }
    }
}

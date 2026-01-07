package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.VolunteerDTO;
import com.intelligent.missingperson.entity.Volunteer;
import com.intelligent.missingperson.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        // use pageable search from service
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<Volunteer> pageResult = volunteerService.findAll(pageable, search);

        List<VolunteerDTO> dtos = pageResult.getContent().stream().map(this::toDTO).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return volunteerService.findById(id)
                .map(v -> ResponseEntity.ok(toDTO(v)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private VolunteerDTO toDTO(Volunteer v) {
        VolunteerDTO.VolunteerDTOBuilder builder = VolunteerDTO.builder()
                .id(v.getId())
                .dateJoined(v.getDateJoined())
                .skills(v.getSkills())
                .rating(v.getRating())
                .volunteerStatus(v.isVolunteerStatus());

        if (v.getAccount() != null) {
            builder.accountId(v.getAccount().getId())
                    .username(v.getAccount().getUsername())
                    .email(v.getAccount().getEmail())
                    .fullName(v.getAccount().getFullName())
                    .phone(v.getAccount().getPhone())
                    .profilePictureUrl(v.getAccount().getProfilePictureUrl());
        }

        return builder.build();
    }
}

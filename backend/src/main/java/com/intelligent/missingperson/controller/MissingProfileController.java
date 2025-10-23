package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingProfileRequest;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/missing-profiles")
@CrossOrigin(origins = "*")
public class MissingProfileController {

    @Autowired
    private MissingProfileRepository missingProfileRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public List<MissingProfile> getAllMissingProfiles() {
        return missingProfileRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MissingProfile> getMissingProfileById(@PathVariable Long id) {
        Optional<MissingProfile> missingProfile = missingProfileRepository.findById(id);
        return missingProfile.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<MissingProfile> getMissingProfilesByStatus(@PathVariable String status) {
        return missingProfileRepository.findByStatus(status);
    }

    @GetMapping("/search")
    public List<MissingProfile> searchMissingProfiles(@RequestParam String name) {
        return missingProfileRepository.findByFullNameContaining(name);
    }

    @PostMapping
    public ResponseEntity<MissingProfile> createMissingProfile(@Valid @RequestBody MissingProfileRequest request) {
        Optional<Area> area = areaRepository.findById(request.getLastSeenAreaId());
        Optional<Account> reporter = accountRepository.findById(request.getReporterId());

        if (area.isEmpty() || reporter.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        MissingProfile missingProfile = new MissingProfile();
        missingProfile.setFullName(request.getFullName());
        missingProfile.setBirthdate(request.getBirthdate());
        missingProfile.setGender(request.getGender());
        missingProfile.setIdentityCardNumber(request.getIdentityCardNumber());
        missingProfile.setHeight(request.getHeight());
        missingProfile.setIdentifyingFeatures(request.getIdentifyingFeatures());
        missingProfile.setReferenceFaceImageURL(request.getReferenceFaceImageURL());
        missingProfile.setMissingTimestamp(request.getMissingTimestamp());
        missingProfile.setReportedDate(new java.util.Date());
        missingProfile.setStatus(request.getStatus());
        missingProfile.setReporter(reporter.get());
        missingProfile.setLastSeenArea(area.get());

        MissingProfile savedProfile = missingProfileRepository.save(missingProfile);
        return ResponseEntity.ok(savedProfile);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MissingProfile> updateMissingProfile(@PathVariable Long id,
                                                             @Valid @RequestBody MissingProfileRequest request) {
        Optional<MissingProfile> existingProfile = missingProfileRepository.findById(id);
        if (existingProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MissingProfile profile = existingProfile.get();
        profile.setFullName(request.getFullName());
        profile.setBirthdate(request.getBirthdate());
        profile.setGender(request.getGender());
        profile.setIdentityCardNumber(request.getIdentityCardNumber());
        profile.setHeight(request.getHeight());
        profile.setIdentifyingFeatures(request.getIdentifyingFeatures());
        profile.setReferenceFaceImageURL(request.getReferenceFaceImageURL());
        profile.setMissingTimestamp(request.getMissingTimestamp());
        profile.setStatus(request.getStatus());

        if (request.getLastSeenAreaId() != null) {
            Optional<Area> area = areaRepository.findById(request.getLastSeenAreaId());
            area.ifPresent(profile::setLastSeenArea);
        }

        MissingProfile updatedProfile = missingProfileRepository.save(profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MissingProfile> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<MissingProfile> missingProfile = missingProfileRepository.findById(id);
        if (missingProfile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MissingProfile profile = missingProfile.get();
        profile.setStatus(status);

        MissingProfile updatedProfile = missingProfileRepository.save(profile);
        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMissingProfile(@PathVariable Long id) {
        if (missingProfileRepository.existsById(id)) {
            missingProfileRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
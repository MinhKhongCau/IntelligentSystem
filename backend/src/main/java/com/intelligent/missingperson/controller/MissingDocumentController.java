package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.MissingDocumentRequest;
import com.intelligent.missingperson.entity.*;
import com.intelligent.missingperson.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/missing-documents")
@CrossOrigin(origins = "*")
public class MissingDocumentController {

    @Autowired
    private MissingDocumentRepository missingDocumentRepository;

    @Autowired
    private AreaRepository areaRepository;

    @Autowired
    private CarePartnerRepository carePartnerRepository;

    @GetMapping
    public List<MissingDocument> getAllMissingDocuments() {
        return missingDocumentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MissingDocument> getMissingDocumentById(@PathVariable Long id) {
        Optional<MissingDocument> missingDocument = missingDocumentRepository.findById(id);
        return missingDocument.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<MissingDocument> getMissingDocumentsByStatus(@PathVariable Boolean status) {
        return missingDocumentRepository.findByStatus(status);
    }

    @GetMapping("/search")
    public List<MissingDocument> searchMissingDocuments(@RequestParam String name) {
        return missingDocumentRepository.findByNameContaining(name);
    }

    @PostMapping
    public ResponseEntity<MissingDocument> createMissingDocument(@Valid @RequestBody MissingDocumentRequest request) {
        Optional<Area> area = areaRepository.findById(request.getMissingAreaId());
        Optional<CarePartner> reporter = carePartnerRepository.findById(request.getReporterId());

        if (area.isEmpty() || reporter.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        MissingDocument missingDocument = new MissingDocument(
                request.getName(),
                request.getBirthday(),
                request.getGender(),
                request.getIdentityCardNumber(),
                request.getHeight(),
                request.getIdentifyingCharacteristic(),
                request.getFacePictureUrl(),
                request.getMissingTime(),
                area.get(),
                reporter.get()
        );

        MissingDocument savedDocument = missingDocumentRepository.save(missingDocument);
        return ResponseEntity.ok(savedDocument);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MissingDocument> updateMissingDocument(@PathVariable Long id, 
                                                               @Valid @RequestBody MissingDocumentRequest request) {
        Optional<MissingDocument> existingDocument = missingDocumentRepository.findById(id);
        if (existingDocument.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MissingDocument document = existingDocument.get();
        document.setName(request.getName());
        document.setBirthday(request.getBirthday());
        document.setGender(request.getGender());
        document.setIdentityCardNumber(request.getIdentityCardNumber());
        document.setHeight(request.getHeight());
        document.setIdentifyingCharacteristic(request.getIdentifyingCharacteristic());
        document.setFacePictureUrl(request.getFacePictureUrl());
        document.setMissingTime(request.getMissingTime());
        document.setUpdateDate(LocalDateTime.now());

        if (request.getMissingAreaId() != null) {
            Optional<Area> area = areaRepository.findById(request.getMissingAreaId());
            area.ifPresent(document::setMissingArea);
        }

        MissingDocument updatedDocument = missingDocumentRepository.save(document);
        return ResponseEntity.ok(updatedDocument);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MissingDocument> updateStatus(@PathVariable Long id, @RequestParam Boolean status) {
        Optional<MissingDocument> missingDocument = missingDocumentRepository.findById(id);
        if (missingDocument.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        MissingDocument document = missingDocument.get();
        document.setStatus(status);
        document.setUpdateDate(LocalDateTime.now());

        MissingDocument updatedDocument = missingDocumentRepository.save(document);
        return ResponseEntity.ok(updatedDocument);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMissingDocument(@PathVariable Long id) {
        if (missingDocumentRepository.existsById(id)) {
            missingDocumentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

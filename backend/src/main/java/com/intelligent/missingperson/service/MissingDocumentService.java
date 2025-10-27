package com.intelligent.missingperson.service;

import com.intelligent.missingperson.entity.MissingDocument;
import com.intelligent.missingperson.repository.MissingDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MissingDocumentService {

    private final MissingDocumentRepository missingDocumentRepository;

    public List<MissingDocument> findAll() {
        return missingDocumentRepository.findAll();
    }

    public Optional<MissingDocument> findById(Integer id) {
        return missingDocumentRepository.findById(id);
    }

    public MissingDocument save(MissingDocument document) {
        return missingDocumentRepository.save(document);
    }

    public void deleteById(Integer id) {
        missingDocumentRepository.deleteById(id);
    }

    public boolean existsById(Integer id) {
        return missingDocumentRepository.existsById(id);
    }

    public List<MissingDocument> findByFullNameContaining(String name) {
        return missingDocumentRepository.findByFullNameContaining(name);
    }

    
}
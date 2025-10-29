package com.intelligent.missingperson.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.intelligent.missingperson.entity.Police;
import com.intelligent.missingperson.repository.PoliceRepository;

@Service
public class PoliceService {
    @Autowired
    private PoliceRepository policeRepository;

    public List<Police> findAll() {
        return policeRepository.findAll();
    }


    public Optional<Police> findById(Integer id) {
        return policeRepository.findById(id);
    }

    public Police save(Police police) {
        return policeRepository.save(police);
    }

    public boolean existsById(Integer id) {
        return policeRepository.existsById(id);
    }

    public void deleteById(Integer id) {
        policeRepository.deleteById(id);
    }
}

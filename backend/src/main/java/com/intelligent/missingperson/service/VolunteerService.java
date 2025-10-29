package com.intelligent.missingperson.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.intelligent.missingperson.entity.Volunteer;
import com.intelligent.missingperson.repository.VolunteerRepository;

@Service
public class VolunteerService {
    @Autowired 
    private VolunteerRepository volunteerRepository;

    public List<Volunteer> findAll() {
        return volunteerRepository.findAll();
    }


    public Optional<Volunteer> findById(Integer id) {
        return volunteerRepository.findById(id);
    }

    public Volunteer save(Volunteer volunteer) {
        return volunteerRepository.save(volunteer);
    }

    public boolean existsById(Integer id) {
        return volunteerRepository.existsById(id);
    }

    public void deleteById(Integer id) {
        volunteerRepository.deleteById(id);
    }
}

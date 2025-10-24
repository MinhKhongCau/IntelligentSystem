package com.intelligent.missingperson.service;

import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    public List<Area> findAll() {
        return areaRepository.findAll();
    }

    public Optional<Area> findById(Integer id) {
        return areaRepository.findById(id);
    }

    public Area save(Area area) {
        return areaRepository.save(area);
    }

    public void deleteById(Integer id) {
        areaRepository.deleteById(id);
    }
}
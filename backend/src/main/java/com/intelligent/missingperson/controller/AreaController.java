package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
public class AreaController {

    @Autowired
    private AreaRepository areaRepository;

    @GetMapping
    public List<Area> getAllAreas() {
        return areaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Area getAreaById(@PathVariable Long id) {
        return areaRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Area createArea(@RequestBody Area area) {
        return areaRepository.save(area);
    }

    @PutMapping("/{id}")
    public Area updateArea(@PathVariable Long id, @RequestBody Area areaDetails) {
        Area area = areaRepository.findById(id).orElse(null);
        if (area != null) {
            area.setCommune(areaDetails.getCommune());
            area.setProvince(areaDetails.getProvince());
            area.setCountry(areaDetails.getCountry());
            return areaRepository.save(area);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteArea(@PathVariable Long id) {
        areaRepository.deleteById(id);
    }
}

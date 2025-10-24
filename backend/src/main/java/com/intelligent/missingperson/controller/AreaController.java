package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.service.AreaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@CrossOrigin(origins = "*")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @GetMapping
    public List<Area> getAllAreas() {
        return areaService.findAll();
    }

    @GetMapping("/{id}")
    public Area getAreaById(@PathVariable Integer id) {
        return areaService.findById(id).orElse(null);
    }

    @PostMapping
    public Area createArea(@RequestBody Area area) {
        return areaService.save(area);
    }

    @PutMapping("/{id}")
    public Area updateArea(@PathVariable Integer id, @RequestBody Area areaDetails) {
        Area area = areaService.findById(id).orElse(null);
        if (area != null) {
            area.setCommune(areaDetails.getCommune());
            area.setProvince(areaDetails.getProvince());
            area.setCountry(areaDetails.getCountry());
            return areaService.save(area);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteArea(@PathVariable Integer id) {
        areaService.deleteById(id);
    }
}

package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.AreaRequest;
import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.service.AreaService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/add")
    // You should secure this, e.g., only allow admins or authenticated users
    // @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<?> createArea(@Valid @RequestBody AreaRequest request) {
        try {
            Area newArea = Area.builder()
                    .commune(request.getCommune())
                    .district(request.getDistrict())
                    .province(request.getProvince())
                    .country(request.getCountry())
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .build();
            
            Area savedArea = areaService.save(newArea); // Assumes AreaService has a save method
            return ResponseEntity.status(201).body(savedArea);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating area: " + e.getMessage());
        }
    }

    
}

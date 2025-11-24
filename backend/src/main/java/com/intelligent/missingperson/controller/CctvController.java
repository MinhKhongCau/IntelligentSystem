package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.CctvDTO;
import com.intelligent.missingperson.service.CctvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cctv")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CctvController {

    private final CctvService cctvService;

    @GetMapping
    public ResponseEntity<List<CctvDTO>> getAllCameras() {
        List<CctvDTO> cameras = cctvService.getAllCameras();
        return ResponseEntity.ok(cameras);
    }

    @GetMapping("/active")
    public ResponseEntity<List<CctvDTO>> getActiveCameras() {
        List<CctvDTO> cameras = cctvService.getActiveCameras();
        return ResponseEntity.ok(cameras);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CctvDTO> getCameraById(@PathVariable Integer id) {
        CctvDTO camera = cctvService.getCameraById(id);
        if (camera != null) {
            return ResponseEntity.ok(camera);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/ip/{ip}")
    public ResponseEntity<CctvDTO> getCameraByIp(@PathVariable String ip) {
        CctvDTO camera = cctvService.getCameraByIp(ip);
        if (camera != null) {
            return ResponseEntity.ok(camera);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<CctvDTO>> getCamerasByArea(@PathVariable Integer areaId) {
        List<CctvDTO> cameras = cctvService.getCamerasByAreaId(areaId);
        return ResponseEntity.ok(cameras);
    }
}

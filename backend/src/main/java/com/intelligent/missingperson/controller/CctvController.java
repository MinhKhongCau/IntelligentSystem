package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.dto.CameraRequest;
import com.intelligent.missingperson.dto.CctvDTO;
import com.intelligent.missingperson.dto.CctvReportDTO;
import com.intelligent.missingperson.entity.Area;
import com.intelligent.missingperson.entity.Cctv;
import com.intelligent.missingperson.repository.CctvRepository;
import com.intelligent.missingperson.repository.CctvReportRepository;
import com.intelligent.missingperson.repository.MissingDocumentRepository;
import com.intelligent.missingperson.service.AreaService;
import com.intelligent.missingperson.service.CctvService;
import com.intelligent.missingperson.service.PictureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cctv")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CctvController {

    private final CctvService cctvService;
    private final CctvRepository cctvRepository;
    private final CctvReportRepository cctvReportRepository;
    private final MissingDocumentRepository missingDocumentRepository;
    private final AreaService areaService;
    private final PictureService pictureService;
    private final com.intelligent.missingperson.service.DetectPictureService detectPictureService;

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

    @PostMapping
    public ResponseEntity<?> createCamera(@RequestBody CameraRequest req) {
        try {
            Cctv c = new Cctv();
            c.setName(req.getName());
            c.setIp(req.getIp());
            c.setStreamUrl(req.getStreamUrl());
            c.setPort(req.getPort());
            c.setCameraType(req.getCameraType());
            c.setStatus(req.getStatus());
            c.setLatitude(req.getLatitude());
            c.setLongitude(req.getLongitude());

            if (req.getLocationId() != null) {
                Optional<Area> areaOpt = areaService.findById(req.getLocationId());
                areaOpt.ifPresent(c::setArea);
            }

            Cctv saved = cctvRepository.save(c);
            CctvDTO dto = cctvService.getCameraById(saved.getId());
            return ResponseEntity.status(201).body(dto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating camera: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCamera(@PathVariable Integer id, @RequestBody CameraRequest req) {
        try {
            Optional<Cctv> opt = cctvRepository.findById(id);
            if (opt.isEmpty()) return ResponseEntity.notFound().build();

            Cctv c = opt.get();
            if (req.getName() != null) c.setName(req.getName());
            if (req.getIp() != null) c.setIp(req.getIp());
            if (req.getStreamUrl() != null) c.setStreamUrl(req.getStreamUrl());
            if (req.getPort() != null) c.setPort(req.getPort());
            if (req.getCameraType() != null) c.setCameraType(req.getCameraType());
            if (req.getStatus() != null) c.setStatus(req.getStatus());
            if (req.getLatitude() != null) c.setLatitude(req.getLatitude());
            if (req.getLongitude() != null) c.setLongitude(req.getLongitude());

            if (req.getLocationId() != null) {
                Optional<Area> a = areaService.findById(req.getLocationId());
                a.ifPresent(c::setArea);
            }

            Cctv saved = cctvRepository.save(c);
            CctvDTO dto = cctvService.getCameraById(saved.getId());
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating camera: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCamera(@PathVariable Integer id) {
        try {
            if (!cctvRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            cctvRepository.deleteById(id);
            return ResponseEntity.ok().body("Camera deleted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting camera: " + e.getMessage());
        }
    }

    // Receive report from external CCTV/streaming service (e.g., Flask app)
    @PostMapping("/report")
    public ResponseEntity<?> receiveReport(@RequestBody CctvReportDTO reportReq) {
        try {
            CctvReportDTO r = reportReq; // local alias
            System.out.println("---> Received CCTV report: " + r);

            // find cctv by id or by ip if provided
            com.intelligent.missingperson.entity.Cctv cctv = null;
            // if (r.getCctvId() != null) {
            //     cctv = cctvRepository.findById(r.getCctvId()).orElse(null);
            // } else 
            if (r.getCctvIp() != null && !r.getCctvIp().isEmpty()) {
                cctv = cctvRepository.findByIp(r.getCctvIp()).orElse(null);
            } else {
                return ResponseEntity.badRequest().body("CCTV identification (id or ip) is required");
            }

            // validate missing document if provided
            com.intelligent.missingperson.entity.MissingDocument missing = null;
            if (r.getMissingDocumentId() != null) {
                missing = missingDocumentRepository.findById(r.getMissingDocumentId()).orElse(null);
                if (missing == null) {
                    return ResponseEntity.badRequest().body("Missing document id not found: " + r.getMissingDocumentId());
                }
            }

            com.intelligent.missingperson.entity.CctvReport cr = new com.intelligent.missingperson.entity.CctvReport();
            cr.setCctv(cctv);
            cr.setMissingDocument(missing);

            // Delegate detect-picture resolution to dedicated service
            String storedLink = detectPictureService.resolveDetectPicture(r, cctv);

            // Use DTO fields directly (no ObjectMapper).
            // Prefer stored image link if available.
            if (storedLink != null) {
                cr.setDetectPicture(storedLink);
            } else {
                cr.setDetectPicture(r.getDetectPicture());
            }

            // Keep original detail text if present; otherwise leave null
            cr.setDetail(r.getDetail());

            cr.setConfident(r.getConfident());
            cr.setDetectionLog(r.getDetectionLog());

            com.intelligent.missingperson.entity.CctvReport saved = cctvReportRepository.save(cr);

            CctvReportDTO out = CctvReportDTO.builder()
                    .id(saved.getId())
                    .cctvId(saved.getCctv() != null ? saved.getCctv().getId() : null)
                    .cctvName(saved.getCctv() != null ? saved.getCctv().getName() : null)
                    .missingDocumentId(saved.getMissingDocument() != null ? saved.getMissingDocument().getId() : null)
                    .timeReport(saved.getTimeReport())
                    .detail(saved.getDetail())
                    .confident(saved.getConfident())
                    .detectionLog(saved.getDetectionLog())
                    .detectPicture(saved.getDetectPicture())
                    .confirmationStatus(saved.getConfirmationStatus())
                    .build();

            return ResponseEntity.status(201).body(out);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving report: " + e.getMessage());
        }
    }

    @GetMapping("/reports/{missingId}")
    public ResponseEntity<?> getReportsForMissing(@PathVariable Integer missingId) {
        try {
            List<com.intelligent.missingperson.entity.CctvReport> list = cctvReportRepository.findByMissingDocumentId(missingId);
            List<CctvReportDTO> dtoList = list.stream().map(r -> CctvReportDTO.builder()
                    .id(r.getId())
                    .cctvId(r.getCctv() != null ? r.getCctv().getId() : null)
                    .cctvName(r.getCctv() != null ? r.getCctv().getName() : null)
                    .missingDocumentId(r.getMissingDocument() != null ? r.getMissingDocument().getId() : null)
                    .timeReport(r.getTimeReport())
                    .detail(r.getDetail())
                    .confident(r.getConfident())
                    .detectionLog(r.getDetectionLog())
                    .detectPicture(r.getDetectPicture())
                    .confirmationStatus(r.getConfirmationStatus())
                    .build()).toList();

            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching reports: " + e.getMessage());
        }
    }
}

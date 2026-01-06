package com.intelligent.missingperson.service;

import com.intelligent.missingperson.dto.CctvDTO;
import com.intelligent.missingperson.entity.Cctv;
import com.intelligent.missingperson.repository.CctvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class CctvService {

    private final CctvRepository cctvRepository;

    @Transactional(readOnly = true)
    public List<CctvDTO> getAllCameras() {
        return cctvRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CctvDTO> getActiveCameras() {
        return cctvRepository.findAllActiveCameras().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<CctvDTO> getCamerasPaged(Pageable pageable, String search) {
        Page<Cctv> page;
        if (search != null && !search.isBlank()) {
            // Search by name or IP
            page = cctvRepository.findByNameContaining(search, pageable);
            if (page == null || page.getTotalElements() == 0) {
                page = cctvRepository.findByIpContaining(search, pageable);
            }
        } else {
            page = cctvRepository.findAll(pageable);
        }
        List<CctvDTO> dtos = page.stream().map(this::convertToDTO).toList();
        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public CctvDTO getCameraById(Integer id) {
        return cctvRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public CctvDTO getCameraByIp(String ip) {
        return cctvRepository.findByIp(ip)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<CctvDTO> getCamerasByAreaId(Integer areaId) {
        return cctvRepository.findByAreaId(areaId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CctvDTO convertToDTO(Cctv cctv) {
        return CctvDTO.builder()
                .id(cctv.getId())
                .name(cctv.getName())
                .status(cctv.getStatus())
                .streamUrl(cctv.getStreamUrl())
                .ip(cctv.getIp())
                .port(cctv.getPort())
                .latitude(cctv.getLatitude())
                .longitude(cctv.getLongitude())
                .cameraType(cctv.getCameraType())
                .lastOnline(cctv.getLastOnline())
                .areaId(cctv.getArea() != null ? cctv.getArea().getId() : null)
                .areaName(cctv.getArea() != null ? getAreaName(cctv.getArea()) : null)
                .build();
    }

    private String getAreaName(com.intelligent.missingperson.entity.Area area) {
        StringBuilder name = new StringBuilder();
        if (area.getCommune() != null && !area.getCommune().isEmpty()) {
            name.append(area.getCommune());
        }
        if (area.getDistrict() != null && !area.getDistrict().isEmpty()) {
            if (name.length() > 0) name.append(", ");
            name.append(area.getDistrict());
        }
        if (area.getProvince() != null && !area.getProvince().isEmpty()) {
            if (name.length() > 0) name.append(", ");
            name.append(area.getProvince());
        }
        return name.length() > 0 ? name.toString() : null;
    }
}

package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.entity.CarePartner;
import com.intelligent.missingperson.repository.CarePartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/care-partners")
@CrossOrigin(origins = "*")
public class CarePartnerController {

    @Autowired
    private CarePartnerRepository carePartnerRepository;

    @GetMapping
    public List<CarePartner> getAllCarePartners() {
        return carePartnerRepository.findAll();
    }

    @GetMapping("/{id}")
    public CarePartner getCarePartnerById(@PathVariable Long id) {
        return carePartnerRepository.findById(id).orElse(null);
    }
}

package com.intelligent.missingperson.controller;

import com.intelligent.missingperson.entity.CarePartner;
import com.intelligent.missingperson.service.CarePartnerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/care-partners")
@CrossOrigin(origins = "*")
public class CarePartnerController {

    @Autowired
    private CarePartnerService carePartnerservice;

    @GetMapping
    public List<CarePartner> getAllCarePartners() {
        return carePartnerservice.findAll();
    }

    @GetMapping("/{id}")
    public CarePartner getCarePartnerById(@PathVariable Integer id) {
        return carePartnerservice.findById(id).orElse(null);
    }
}

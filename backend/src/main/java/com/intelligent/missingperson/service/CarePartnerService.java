package com.intelligent.missingperson.service;

import com.intelligent.missingperson.entity.CarePartner;
import com.intelligent.missingperson.repository.CarePartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarePartnerService {

    private final CarePartnerRepository carePartnerRepository;

    public List<CarePartner> findAll() {
        return carePartnerRepository.findAll();
    }

    public Optional<CarePartner> findById(Integer id) {
        return carePartnerRepository.findById(id);
    }

    public CarePartner save(CarePartner carePartner) {
        return carePartnerRepository.save(carePartner);
    }
}
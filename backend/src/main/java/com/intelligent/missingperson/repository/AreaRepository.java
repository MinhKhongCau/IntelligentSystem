package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {
    List<Area> findByProvince(String province);
    List<Area> findByCountry(String country);
}

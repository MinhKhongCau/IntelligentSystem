package com.intelligent.missingperson.repository;

import com.intelligent.missingperson.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AreaRepository extends JpaRepository<Area, Integer> {
    @Query(value = "SELECT * FROM AREA AS a WHERE a.Province LIKE '%:province%';", nativeQuery = true)
    List<Area> findByProvince(@Param("province") String province);
    @Query(value = "SELECT * FROM AREA AS a WHERE a.Country LIKE '%:country%';", nativeQuery = true)
    List<Area> findByCountry(@Param("country")String country);
}

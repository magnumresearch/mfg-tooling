package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.QualityControlStep;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the QualityControlStep entity.
 */
public interface QualityControlStepRepository extends JpaRepository<QualityControlStep,Long> {

}

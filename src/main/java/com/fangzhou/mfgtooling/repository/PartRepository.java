package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.Part;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Part entity.
 */
public interface PartRepository extends JpaRepository<Part,Long> {

}

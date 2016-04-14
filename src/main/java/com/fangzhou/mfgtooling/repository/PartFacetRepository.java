package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.PartFacet;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the PartFacet entity.
 */
public interface PartFacetRepository extends JpaRepository<PartFacet,Long> {

}

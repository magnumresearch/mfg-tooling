package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.Processes;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Processes entity.
 */
public interface ProcessesRepository extends JpaRepository<Processes,Long> {

}

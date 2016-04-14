package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.ComputerController;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the ComputerController entity.
 */
public interface ComputerControllerRepository extends JpaRepository<ComputerController,Long> {

}

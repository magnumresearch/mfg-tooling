package com.fangzhou.mfgtooling.repository;

import com.fangzhou.mfgtooling.domain.Attack;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Attack entity.
 */
public interface AttackRepository extends JpaRepository<Attack,Long> {

}

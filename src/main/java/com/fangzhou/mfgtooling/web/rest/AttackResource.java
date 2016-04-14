package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.Attack;
import com.fangzhou.mfgtooling.repository.AttackRepository;
import com.fangzhou.mfgtooling.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Attack.
 */
@RestController
@RequestMapping("/api")
public class AttackResource {

    private final Logger log = LoggerFactory.getLogger(AttackResource.class);
        
    @Inject
    private AttackRepository attackRepository;
    
    /**
     * POST  /attacks : Create a new attack.
     *
     * @param attack the attack to create
     * @return the ResponseEntity with status 201 (Created) and with body the new attack, or with status 400 (Bad Request) if the attack has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/attacks",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Attack> createAttack(@RequestBody Attack attack) throws URISyntaxException {
        log.debug("REST request to save Attack : {}", attack);
        if (attack.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("attack", "idexists", "A new attack cannot already have an ID")).body(null);
        }
        Attack result = attackRepository.save(attack);
        return ResponseEntity.created(new URI("/api/attacks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("attack", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /attacks : Updates an existing attack.
     *
     * @param attack the attack to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated attack,
     * or with status 400 (Bad Request) if the attack is not valid,
     * or with status 500 (Internal Server Error) if the attack couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/attacks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Attack> updateAttack(@RequestBody Attack attack) throws URISyntaxException {
        log.debug("REST request to update Attack : {}", attack);
        if (attack.getId() == null) {
            return createAttack(attack);
        }
        Attack result = attackRepository.save(attack);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("attack", attack.getId().toString()))
            .body(result);
    }

    /**
     * GET  /attacks : get all the attacks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of attacks in body
     */
    @RequestMapping(value = "/attacks",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Attack> getAllAttacks() {
        log.debug("REST request to get all Attacks");
        List<Attack> attacks = attackRepository.findAll();
        return attacks;
    }

    /**
     * GET  /attacks/:id : get the "id" attack.
     *
     * @param id the id of the attack to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the attack, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/attacks/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Attack> getAttack(@PathVariable Long id) {
        log.debug("REST request to get Attack : {}", id);
        Attack attack = attackRepository.findOne(id);
        return Optional.ofNullable(attack)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /attacks/:id : delete the "id" attack.
     *
     * @param id the id of the attack to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/attacks/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteAttack(@PathVariable Long id) {
        log.debug("REST request to delete Attack : {}", id);
        attackRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("attack", id.toString())).build();
    }

}

package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.Part;
import com.fangzhou.mfgtooling.repository.PartRepository;
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
 * REST controller for managing Part.
 */
@RestController
@RequestMapping("/api")
public class PartResource {

    private final Logger log = LoggerFactory.getLogger(PartResource.class);
        
    @Inject
    private PartRepository partRepository;
    
    /**
     * POST  /parts : Create a new part.
     *
     * @param part the part to create
     * @return the ResponseEntity with status 201 (Created) and with body the new part, or with status 400 (Bad Request) if the part has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/parts",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Part> createPart(@RequestBody Part part) throws URISyntaxException {
        log.debug("REST request to save Part : {}", part);
        if (part.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("part", "idexists", "A new part cannot already have an ID")).body(null);
        }
        Part result = partRepository.save(part);
        return ResponseEntity.created(new URI("/api/parts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("part", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /parts : Updates an existing part.
     *
     * @param part the part to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated part,
     * or with status 400 (Bad Request) if the part is not valid,
     * or with status 500 (Internal Server Error) if the part couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/parts",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Part> updatePart(@RequestBody Part part) throws URISyntaxException {
        log.debug("REST request to update Part : {}", part);
        if (part.getId() == null) {
            return createPart(part);
        }
        Part result = partRepository.save(part);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("part", part.getId().toString()))
            .body(result);
    }

    /**
     * GET  /parts : get all the parts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of parts in body
     */
    @RequestMapping(value = "/parts",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Part> getAllParts() {
        log.debug("REST request to get all Parts");
        List<Part> parts = partRepository.findAll();
        return parts;
    }

    /**
     * GET  /parts/:id : get the "id" part.
     *
     * @param id the id of the part to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the part, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/parts/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Part> getPart(@PathVariable Long id) {
        log.debug("REST request to get Part : {}", id);
        Part part = partRepository.findOne(id);
        return Optional.ofNullable(part)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /parts/:id : delete the "id" part.
     *
     * @param id the id of the part to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/parts/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePart(@PathVariable Long id) {
        log.debug("REST request to delete Part : {}", id);
        partRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("part", id.toString())).build();
    }

}

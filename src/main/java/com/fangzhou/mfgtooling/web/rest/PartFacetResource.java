package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.PartFacet;
import com.fangzhou.mfgtooling.repository.PartFacetRepository;
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
 * REST controller for managing PartFacet.
 */
@RestController
@RequestMapping("/api")
public class PartFacetResource {

    private final Logger log = LoggerFactory.getLogger(PartFacetResource.class);
        
    @Inject
    private PartFacetRepository partFacetRepository;
    
    /**
     * POST  /part-facets : Create a new partFacet.
     *
     * @param partFacet the partFacet to create
     * @return the ResponseEntity with status 201 (Created) and with body the new partFacet, or with status 400 (Bad Request) if the partFacet has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/part-facets",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PartFacet> createPartFacet(@RequestBody PartFacet partFacet) throws URISyntaxException {
        log.debug("REST request to save PartFacet : {}", partFacet);
        if (partFacet.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("partFacet", "idexists", "A new partFacet cannot already have an ID")).body(null);
        }
        PartFacet result = partFacetRepository.save(partFacet);
        return ResponseEntity.created(new URI("/api/part-facets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("partFacet", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /part-facets : Updates an existing partFacet.
     *
     * @param partFacet the partFacet to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated partFacet,
     * or with status 400 (Bad Request) if the partFacet is not valid,
     * or with status 500 (Internal Server Error) if the partFacet couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/part-facets",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PartFacet> updatePartFacet(@RequestBody PartFacet partFacet) throws URISyntaxException {
        log.debug("REST request to update PartFacet : {}", partFacet);
        if (partFacet.getId() == null) {
            return createPartFacet(partFacet);
        }
        PartFacet result = partFacetRepository.save(partFacet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("partFacet", partFacet.getId().toString()))
            .body(result);
    }

    /**
     * GET  /part-facets : get all the partFacets.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of partFacets in body
     */
    @RequestMapping(value = "/part-facets",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PartFacet> getAllPartFacets() {
        log.debug("REST request to get all PartFacets");
        List<PartFacet> partFacets = partFacetRepository.findAll();
        return partFacets;
    }

    /**
     * GET  /part-facets/:id : get the "id" partFacet.
     *
     * @param id the id of the partFacet to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the partFacet, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/part-facets/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PartFacet> getPartFacet(@PathVariable Long id) {
        log.debug("REST request to get PartFacet : {}", id);
        PartFacet partFacet = partFacetRepository.findOne(id);
        return Optional.ofNullable(partFacet)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /part-facets/:id : delete the "id" partFacet.
     *
     * @param id the id of the partFacet to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/part-facets/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePartFacet(@PathVariable Long id) {
        log.debug("REST request to delete PartFacet : {}", id);
        partFacetRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("partFacet", id.toString())).build();
    }

}

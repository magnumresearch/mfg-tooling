package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.QualityControlStep;
import com.fangzhou.mfgtooling.repository.QualityControlStepRepository;
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
 * REST controller for managing QualityControlStep.
 */
@RestController
@RequestMapping("/api")
public class QualityControlStepResource {

    private final Logger log = LoggerFactory.getLogger(QualityControlStepResource.class);
        
    @Inject
    private QualityControlStepRepository qualityControlStepRepository;
    
    /**
     * POST  /quality-control-steps : Create a new qualityControlStep.
     *
     * @param qualityControlStep the qualityControlStep to create
     * @return the ResponseEntity with status 201 (Created) and with body the new qualityControlStep, or with status 400 (Bad Request) if the qualityControlStep has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/quality-control-steps",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<QualityControlStep> createQualityControlStep(@RequestBody QualityControlStep qualityControlStep) throws URISyntaxException {
        log.debug("REST request to save QualityControlStep : {}", qualityControlStep);
        if (qualityControlStep.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("qualityControlStep", "idexists", "A new qualityControlStep cannot already have an ID")).body(null);
        }
        QualityControlStep result = qualityControlStepRepository.save(qualityControlStep);
        return ResponseEntity.created(new URI("/api/quality-control-steps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("qualityControlStep", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /quality-control-steps : Updates an existing qualityControlStep.
     *
     * @param qualityControlStep the qualityControlStep to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated qualityControlStep,
     * or with status 400 (Bad Request) if the qualityControlStep is not valid,
     * or with status 500 (Internal Server Error) if the qualityControlStep couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/quality-control-steps",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<QualityControlStep> updateQualityControlStep(@RequestBody QualityControlStep qualityControlStep) throws URISyntaxException {
        log.debug("REST request to update QualityControlStep : {}", qualityControlStep);
        if (qualityControlStep.getId() == null) {
            return createQualityControlStep(qualityControlStep);
        }
        QualityControlStep result = qualityControlStepRepository.save(qualityControlStep);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("qualityControlStep", qualityControlStep.getId().toString()))
            .body(result);
    }

    /**
     * GET  /quality-control-steps : get all the qualityControlSteps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of qualityControlSteps in body
     */
    @RequestMapping(value = "/quality-control-steps",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<QualityControlStep> getAllQualityControlSteps() {
        log.debug("REST request to get all QualityControlSteps");
        List<QualityControlStep> qualityControlSteps = qualityControlStepRepository.findAll();
        return qualityControlSteps;
    }

    /**
     * GET  /quality-control-steps/:id : get the "id" qualityControlStep.
     *
     * @param id the id of the qualityControlStep to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the qualityControlStep, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/quality-control-steps/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<QualityControlStep> getQualityControlStep(@PathVariable Long id) {
        log.debug("REST request to get QualityControlStep : {}", id);
        QualityControlStep qualityControlStep = qualityControlStepRepository.findOne(id);
        return Optional.ofNullable(qualityControlStep)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /quality-control-steps/:id : delete the "id" qualityControlStep.
     *
     * @param id the id of the qualityControlStep to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/quality-control-steps/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteQualityControlStep(@PathVariable Long id) {
        log.debug("REST request to delete QualityControlStep : {}", id);
        qualityControlStepRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("qualityControlStep", id.toString())).build();
    }

}

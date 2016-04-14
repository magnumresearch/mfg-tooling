package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.ProcessStep;
import com.fangzhou.mfgtooling.repository.ProcessStepRepository;
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
 * REST controller for managing ProcessStep.
 */
@RestController
@RequestMapping("/api")
public class ProcessStepResource {

    private final Logger log = LoggerFactory.getLogger(ProcessStepResource.class);
        
    @Inject
    private ProcessStepRepository processStepRepository;
    
    /**
     * POST  /process-steps : Create a new processStep.
     *
     * @param processStep the processStep to create
     * @return the ResponseEntity with status 201 (Created) and with body the new processStep, or with status 400 (Bad Request) if the processStep has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/process-steps",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProcessStep> createProcessStep(@RequestBody ProcessStep processStep) throws URISyntaxException {
        log.debug("REST request to save ProcessStep : {}", processStep);
        if (processStep.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("processStep", "idexists", "A new processStep cannot already have an ID")).body(null);
        }
        ProcessStep result = processStepRepository.save(processStep);
        return ResponseEntity.created(new URI("/api/process-steps/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("processStep", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /process-steps : Updates an existing processStep.
     *
     * @param processStep the processStep to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated processStep,
     * or with status 400 (Bad Request) if the processStep is not valid,
     * or with status 500 (Internal Server Error) if the processStep couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/process-steps",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProcessStep> updateProcessStep(@RequestBody ProcessStep processStep) throws URISyntaxException {
        log.debug("REST request to update ProcessStep : {}", processStep);
        if (processStep.getId() == null) {
            return createProcessStep(processStep);
        }
        ProcessStep result = processStepRepository.save(processStep);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("processStep", processStep.getId().toString()))
            .body(result);
    }

    /**
     * GET  /process-steps : get all the processSteps.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of processSteps in body
     */
    @RequestMapping(value = "/process-steps",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<ProcessStep> getAllProcessSteps() {
        log.debug("REST request to get all ProcessSteps");
        List<ProcessStep> processSteps = processStepRepository.findAll();
        return processSteps;
    }

    /**
     * GET  /process-steps/:id : get the "id" processStep.
     *
     * @param id the id of the processStep to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the processStep, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/process-steps/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ProcessStep> getProcessStep(@PathVariable Long id) {
        log.debug("REST request to get ProcessStep : {}", id);
        ProcessStep processStep = processStepRepository.findOne(id);
        return Optional.ofNullable(processStep)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /process-steps/:id : delete the "id" processStep.
     *
     * @param id the id of the processStep to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/process-steps/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteProcessStep(@PathVariable Long id) {
        log.debug("REST request to delete ProcessStep : {}", id);
        processStepRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("processStep", id.toString())).build();
    }

}

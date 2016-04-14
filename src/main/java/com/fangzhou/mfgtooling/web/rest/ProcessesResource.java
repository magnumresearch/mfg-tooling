package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.Processes;
import com.fangzhou.mfgtooling.repository.ProcessesRepository;
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
 * REST controller for managing Processes.
 */
@RestController
@RequestMapping("/api")
public class ProcessesResource {

    private final Logger log = LoggerFactory.getLogger(ProcessesResource.class);
        
    @Inject
    private ProcessesRepository processesRepository;
    
    /**
     * POST  /processes : Create a new processes.
     *
     * @param processes the processes to create
     * @return the ResponseEntity with status 201 (Created) and with body the new processes, or with status 400 (Bad Request) if the processes has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/processes",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Processes> createProcesses(@RequestBody Processes processes) throws URISyntaxException {
        log.debug("REST request to save Processes : {}", processes);
        if (processes.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("processes", "idexists", "A new processes cannot already have an ID")).body(null);
        }
        Processes result = processesRepository.save(processes);
        return ResponseEntity.created(new URI("/api/processes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("processes", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /processes : Updates an existing processes.
     *
     * @param processes the processes to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated processes,
     * or with status 400 (Bad Request) if the processes is not valid,
     * or with status 500 (Internal Server Error) if the processes couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/processes",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Processes> updateProcesses(@RequestBody Processes processes) throws URISyntaxException {
        log.debug("REST request to update Processes : {}", processes);
        if (processes.getId() == null) {
            return createProcesses(processes);
        }
        Processes result = processesRepository.save(processes);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("processes", processes.getId().toString()))
            .body(result);
    }

    /**
     * GET  /processes : get all the processes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of processes in body
     */
    @RequestMapping(value = "/processes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Processes> getAllProcesses() {
        log.debug("REST request to get all Processes");
        List<Processes> processes = processesRepository.findAll();
        return processes;
    }

    /**
     * GET  /processes/:id : get the "id" processes.
     *
     * @param id the id of the processes to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the processes, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/processes/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Processes> getProcesses(@PathVariable Long id) {
        log.debug("REST request to get Processes : {}", id);
        Processes processes = processesRepository.findOne(id);
        return Optional.ofNullable(processes)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /processes/:id : delete the "id" processes.
     *
     * @param id the id of the processes to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/processes/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteProcesses(@PathVariable Long id) {
        log.debug("REST request to delete Processes : {}", id);
        processesRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("processes", id.toString())).build();
    }

}

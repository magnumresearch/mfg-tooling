package com.fangzhou.mfgtooling.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.fangzhou.mfgtooling.domain.ComputerController;
import com.fangzhou.mfgtooling.repository.ComputerControllerRepository;
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
 * REST controller for managing ComputerController.
 */
@RestController
@RequestMapping("/api")
public class ComputerControllerResource {

    private final Logger log = LoggerFactory.getLogger(ComputerControllerResource.class);
        
    @Inject
    private ComputerControllerRepository computerControllerRepository;
    
    /**
     * POST  /computer-controllers : Create a new computerController.
     *
     * @param computerController the computerController to create
     * @return the ResponseEntity with status 201 (Created) and with body the new computerController, or with status 400 (Bad Request) if the computerController has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/computer-controllers",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ComputerController> createComputerController(@RequestBody ComputerController computerController) throws URISyntaxException {
        log.debug("REST request to save ComputerController : {}", computerController);
        if (computerController.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("computerController", "idexists", "A new computerController cannot already have an ID")).body(null);
        }
        ComputerController result = computerControllerRepository.save(computerController);
        return ResponseEntity.created(new URI("/api/computer-controllers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("computerController", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /computer-controllers : Updates an existing computerController.
     *
     * @param computerController the computerController to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated computerController,
     * or with status 400 (Bad Request) if the computerController is not valid,
     * or with status 500 (Internal Server Error) if the computerController couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/computer-controllers",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ComputerController> updateComputerController(@RequestBody ComputerController computerController) throws URISyntaxException {
        log.debug("REST request to update ComputerController : {}", computerController);
        if (computerController.getId() == null) {
            return createComputerController(computerController);
        }
        ComputerController result = computerControllerRepository.save(computerController);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("computerController", computerController.getId().toString()))
            .body(result);
    }

    /**
     * GET  /computer-controllers : get all the computerControllers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of computerControllers in body
     */
    @RequestMapping(value = "/computer-controllers",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<ComputerController> getAllComputerControllers() {
        log.debug("REST request to get all ComputerControllers");
        List<ComputerController> computerControllers = computerControllerRepository.findAll();
        return computerControllers;
    }

    /**
     * GET  /computer-controllers/:id : get the "id" computerController.
     *
     * @param id the id of the computerController to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the computerController, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/computer-controllers/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ComputerController> getComputerController(@PathVariable Long id) {
        log.debug("REST request to get ComputerController : {}", id);
        ComputerController computerController = computerControllerRepository.findOne(id);
        return Optional.ofNullable(computerController)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /computer-controllers/:id : delete the "id" computerController.
     *
     * @param id the id of the computerController to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/computer-controllers/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteComputerController(@PathVariable Long id) {
        log.debug("REST request to delete ComputerController : {}", id);
        computerControllerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("computerController", id.toString())).build();
    }

}

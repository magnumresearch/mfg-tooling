package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.ComputerController;
import com.fangzhou.mfgtooling.repository.ComputerControllerRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fangzhou.mfgtooling.domain.enumeration.Connectivity;

/**
 * Test class for the ComputerControllerResource REST controller.
 *
 * @see ComputerControllerResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class ComputerControllerResourceIntTest {

    private static final String DEFAULT_OPERATING_SYSTEM = "AAAAA";
    private static final String UPDATED_OPERATING_SYSTEM = "BBBBB";
    private static final String DEFAULT_OPERATING_SOFTWARE = "AAAAA";
    private static final String UPDATED_OPERATING_SOFTWARE = "BBBBB";

    private static final Connectivity DEFAULT_NETWORK = Connectivity.LOCAL;
    private static final Connectivity UPDATED_NETWORK = Connectivity.LAN;

    @Inject
    private ComputerControllerRepository computerControllerRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restComputerControllerMockMvc;

    private ComputerController computerController;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ComputerControllerResource computerControllerResource = new ComputerControllerResource();
        ReflectionTestUtils.setField(computerControllerResource, "computerControllerRepository", computerControllerRepository);
        this.restComputerControllerMockMvc = MockMvcBuilders.standaloneSetup(computerControllerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        computerController = new ComputerController();
        computerController.setOperatingSystem(DEFAULT_OPERATING_SYSTEM);
        computerController.setOperatingSoftware(DEFAULT_OPERATING_SOFTWARE);
        computerController.setNetwork(DEFAULT_NETWORK);
    }

    @Test
    @Transactional
    public void createComputerController() throws Exception {
        int databaseSizeBeforeCreate = computerControllerRepository.findAll().size();

        // Create the ComputerController

        restComputerControllerMockMvc.perform(post("/api/computer-controllers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(computerController)))
                .andExpect(status().isCreated());

        // Validate the ComputerController in the database
        List<ComputerController> computerControllers = computerControllerRepository.findAll();
        assertThat(computerControllers).hasSize(databaseSizeBeforeCreate + 1);
        ComputerController testComputerController = computerControllers.get(computerControllers.size() - 1);
        assertThat(testComputerController.getOperatingSystem()).isEqualTo(DEFAULT_OPERATING_SYSTEM);
        assertThat(testComputerController.getOperatingSoftware()).isEqualTo(DEFAULT_OPERATING_SOFTWARE);
        assertThat(testComputerController.getNetwork()).isEqualTo(DEFAULT_NETWORK);
    }

    @Test
    @Transactional
    public void getAllComputerControllers() throws Exception {
        // Initialize the database
        computerControllerRepository.saveAndFlush(computerController);

        // Get all the computerControllers
        restComputerControllerMockMvc.perform(get("/api/computer-controllers?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(computerController.getId().intValue())))
                .andExpect(jsonPath("$.[*].operatingSystem").value(hasItem(DEFAULT_OPERATING_SYSTEM.toString())))
                .andExpect(jsonPath("$.[*].operatingSoftware").value(hasItem(DEFAULT_OPERATING_SOFTWARE.toString())))
                .andExpect(jsonPath("$.[*].network").value(hasItem(DEFAULT_NETWORK.toString())));
    }

    @Test
    @Transactional
    public void getComputerController() throws Exception {
        // Initialize the database
        computerControllerRepository.saveAndFlush(computerController);

        // Get the computerController
        restComputerControllerMockMvc.perform(get("/api/computer-controllers/{id}", computerController.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(computerController.getId().intValue()))
            .andExpect(jsonPath("$.operatingSystem").value(DEFAULT_OPERATING_SYSTEM.toString()))
            .andExpect(jsonPath("$.operatingSoftware").value(DEFAULT_OPERATING_SOFTWARE.toString()))
            .andExpect(jsonPath("$.network").value(DEFAULT_NETWORK.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingComputerController() throws Exception {
        // Get the computerController
        restComputerControllerMockMvc.perform(get("/api/computer-controllers/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateComputerController() throws Exception {
        // Initialize the database
        computerControllerRepository.saveAndFlush(computerController);
        int databaseSizeBeforeUpdate = computerControllerRepository.findAll().size();

        // Update the computerController
        ComputerController updatedComputerController = new ComputerController();
        updatedComputerController.setId(computerController.getId());
        updatedComputerController.setOperatingSystem(UPDATED_OPERATING_SYSTEM);
        updatedComputerController.setOperatingSoftware(UPDATED_OPERATING_SOFTWARE);
        updatedComputerController.setNetwork(UPDATED_NETWORK);

        restComputerControllerMockMvc.perform(put("/api/computer-controllers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedComputerController)))
                .andExpect(status().isOk());

        // Validate the ComputerController in the database
        List<ComputerController> computerControllers = computerControllerRepository.findAll();
        assertThat(computerControllers).hasSize(databaseSizeBeforeUpdate);
        ComputerController testComputerController = computerControllers.get(computerControllers.size() - 1);
        assertThat(testComputerController.getOperatingSystem()).isEqualTo(UPDATED_OPERATING_SYSTEM);
        assertThat(testComputerController.getOperatingSoftware()).isEqualTo(UPDATED_OPERATING_SOFTWARE);
        assertThat(testComputerController.getNetwork()).isEqualTo(UPDATED_NETWORK);
    }

    @Test
    @Transactional
    public void deleteComputerController() throws Exception {
        // Initialize the database
        computerControllerRepository.saveAndFlush(computerController);
        int databaseSizeBeforeDelete = computerControllerRepository.findAll().size();

        // Get the computerController
        restComputerControllerMockMvc.perform(delete("/api/computer-controllers/{id}", computerController.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<ComputerController> computerControllers = computerControllerRepository.findAll();
        assertThat(computerControllers).hasSize(databaseSizeBeforeDelete - 1);
    }
}

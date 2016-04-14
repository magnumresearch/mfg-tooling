package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.ProcessStep;
import com.fangzhou.mfgtooling.repository.ProcessStepRepository;

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

import com.fangzhou.mfgtooling.domain.enumeration.ProcessType;

/**
 * Test class for the ProcessStepResource REST controller.
 *
 * @see ProcessStepResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class ProcessStepResourceIntTest {


    private static final ProcessType DEFAULT_TYPE = ProcessType.CUTTING;
    private static final ProcessType UPDATED_TYPE = ProcessType.FORMING;
    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    @Inject
    private ProcessStepRepository processStepRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restProcessStepMockMvc;

    private ProcessStep processStep;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ProcessStepResource processStepResource = new ProcessStepResource();
        ReflectionTestUtils.setField(processStepResource, "processStepRepository", processStepRepository);
        this.restProcessStepMockMvc = MockMvcBuilders.standaloneSetup(processStepResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        processStep = new ProcessStep();
        processStep.setType(DEFAULT_TYPE);
        processStep.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createProcessStep() throws Exception {
        int databaseSizeBeforeCreate = processStepRepository.findAll().size();

        // Create the ProcessStep

        restProcessStepMockMvc.perform(post("/api/process-steps")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(processStep)))
                .andExpect(status().isCreated());

        // Validate the ProcessStep in the database
        List<ProcessStep> processSteps = processStepRepository.findAll();
        assertThat(processSteps).hasSize(databaseSizeBeforeCreate + 1);
        ProcessStep testProcessStep = processSteps.get(processSteps.size() - 1);
        assertThat(testProcessStep.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testProcessStep.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void getAllProcessSteps() throws Exception {
        // Initialize the database
        processStepRepository.saveAndFlush(processStep);

        // Get all the processSteps
        restProcessStepMockMvc.perform(get("/api/process-steps?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(processStep.getId().intValue())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getProcessStep() throws Exception {
        // Initialize the database
        processStepRepository.saveAndFlush(processStep);

        // Get the processStep
        restProcessStepMockMvc.perform(get("/api/process-steps/{id}", processStep.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(processStep.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProcessStep() throws Exception {
        // Get the processStep
        restProcessStepMockMvc.perform(get("/api/process-steps/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProcessStep() throws Exception {
        // Initialize the database
        processStepRepository.saveAndFlush(processStep);
        int databaseSizeBeforeUpdate = processStepRepository.findAll().size();

        // Update the processStep
        ProcessStep updatedProcessStep = new ProcessStep();
        updatedProcessStep.setId(processStep.getId());
        updatedProcessStep.setType(UPDATED_TYPE);
        updatedProcessStep.setName(UPDATED_NAME);

        restProcessStepMockMvc.perform(put("/api/process-steps")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedProcessStep)))
                .andExpect(status().isOk());

        // Validate the ProcessStep in the database
        List<ProcessStep> processSteps = processStepRepository.findAll();
        assertThat(processSteps).hasSize(databaseSizeBeforeUpdate);
        ProcessStep testProcessStep = processSteps.get(processSteps.size() - 1);
        assertThat(testProcessStep.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testProcessStep.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteProcessStep() throws Exception {
        // Initialize the database
        processStepRepository.saveAndFlush(processStep);
        int databaseSizeBeforeDelete = processStepRepository.findAll().size();

        // Get the processStep
        restProcessStepMockMvc.perform(delete("/api/process-steps/{id}", processStep.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<ProcessStep> processSteps = processStepRepository.findAll();
        assertThat(processSteps).hasSize(databaseSizeBeforeDelete - 1);
    }
}

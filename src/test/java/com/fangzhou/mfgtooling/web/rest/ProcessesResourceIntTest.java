package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.Processes;
import com.fangzhou.mfgtooling.repository.ProcessesRepository;

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


/**
 * Test class for the ProcessesResource REST controller.
 *
 * @see ProcessesResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class ProcessesResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    @Inject
    private ProcessesRepository processesRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restProcessesMockMvc;

    private Processes processes;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ProcessesResource processesResource = new ProcessesResource();
        ReflectionTestUtils.setField(processesResource, "processesRepository", processesRepository);
        this.restProcessesMockMvc = MockMvcBuilders.standaloneSetup(processesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        processes = new Processes();
        processes.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createProcesses() throws Exception {
        int databaseSizeBeforeCreate = processesRepository.findAll().size();

        // Create the Processes

        restProcessesMockMvc.perform(post("/api/processes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(processes)))
                .andExpect(status().isCreated());

        // Validate the Processes in the database
        List<Processes> processes = processesRepository.findAll();
        assertThat(processes).hasSize(databaseSizeBeforeCreate + 1);
        Processes testProcesses = processes.get(processes.size() - 1);
        assertThat(testProcesses.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void getAllProcesses() throws Exception {
        // Initialize the database
        processesRepository.saveAndFlush(processes);

        // Get all the processes
        restProcessesMockMvc.perform(get("/api/processes?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(processes.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getProcesses() throws Exception {
        // Initialize the database
        processesRepository.saveAndFlush(processes);

        // Get the processes
        restProcessesMockMvc.perform(get("/api/processes/{id}", processes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(processes.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProcesses() throws Exception {
        // Get the processes
        restProcessesMockMvc.perform(get("/api/processes/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProcesses() throws Exception {
        // Initialize the database
        processesRepository.saveAndFlush(processes);
        int databaseSizeBeforeUpdate = processesRepository.findAll().size();

        // Update the processes
        Processes updatedProcesses = new Processes();
        updatedProcesses.setId(processes.getId());
        updatedProcesses.setName(UPDATED_NAME);

        restProcessesMockMvc.perform(put("/api/processes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedProcesses)))
                .andExpect(status().isOk());

        // Validate the Processes in the database
        List<Processes> processes = processesRepository.findAll();
        assertThat(processes).hasSize(databaseSizeBeforeUpdate);
        Processes testProcesses = processes.get(processes.size() - 1);
        assertThat(testProcesses.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deleteProcesses() throws Exception {
        // Initialize the database
        processesRepository.saveAndFlush(processes);
        int databaseSizeBeforeDelete = processesRepository.findAll().size();

        // Get the processes
        restProcessesMockMvc.perform(delete("/api/processes/{id}", processes.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Processes> processes = processesRepository.findAll();
        assertThat(processes).hasSize(databaseSizeBeforeDelete - 1);
    }
}

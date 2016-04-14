package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.QualityControlStep;
import com.fangzhou.mfgtooling.repository.QualityControlStepRepository;

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

import com.fangzhou.mfgtooling.domain.enumeration.QualityControlType;

/**
 * Test class for the QualityControlStepResource REST controller.
 *
 * @see QualityControlStepResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class QualityControlStepResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";

    private static final QualityControlType DEFAULT_TYPE = QualityControlType.VISUAL_INSPECTION;
    private static final QualityControlType UPDATED_TYPE = QualityControlType.DIMENSION_MEASURE;
    private static final String DEFAULT_FEATURE = "AAAAA";
    private static final String UPDATED_FEATURE = "BBBBB";
    private static final String DEFAULT_CUSTOM_CONSTRAINT = "AAAAA";
    private static final String UPDATED_CUSTOM_CONSTRAINT = "BBBBB";

    @Inject
    private QualityControlStepRepository qualityControlStepRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restQualityControlStepMockMvc;

    private QualityControlStep qualityControlStep;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        QualityControlStepResource qualityControlStepResource = new QualityControlStepResource();
        ReflectionTestUtils.setField(qualityControlStepResource, "qualityControlStepRepository", qualityControlStepRepository);
        this.restQualityControlStepMockMvc = MockMvcBuilders.standaloneSetup(qualityControlStepResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        qualityControlStep = new QualityControlStep();
        qualityControlStep.setName(DEFAULT_NAME);
        qualityControlStep.setType(DEFAULT_TYPE);
        qualityControlStep.setFeature(DEFAULT_FEATURE);
        qualityControlStep.setCustomConstraint(DEFAULT_CUSTOM_CONSTRAINT);
    }

    @Test
    @Transactional
    public void createQualityControlStep() throws Exception {
        int databaseSizeBeforeCreate = qualityControlStepRepository.findAll().size();

        // Create the QualityControlStep

        restQualityControlStepMockMvc.perform(post("/api/quality-control-steps")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(qualityControlStep)))
                .andExpect(status().isCreated());

        // Validate the QualityControlStep in the database
        List<QualityControlStep> qualityControlSteps = qualityControlStepRepository.findAll();
        assertThat(qualityControlSteps).hasSize(databaseSizeBeforeCreate + 1);
        QualityControlStep testQualityControlStep = qualityControlSteps.get(qualityControlSteps.size() - 1);
        assertThat(testQualityControlStep.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQualityControlStep.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testQualityControlStep.getFeature()).isEqualTo(DEFAULT_FEATURE);
        assertThat(testQualityControlStep.getCustomConstraint()).isEqualTo(DEFAULT_CUSTOM_CONSTRAINT);
    }

    @Test
    @Transactional
    public void getAllQualityControlSteps() throws Exception {
        // Initialize the database
        qualityControlStepRepository.saveAndFlush(qualityControlStep);

        // Get all the qualityControlSteps
        restQualityControlStepMockMvc.perform(get("/api/quality-control-steps?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(qualityControlStep.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
                .andExpect(jsonPath("$.[*].feature").value(hasItem(DEFAULT_FEATURE.toString())))
                .andExpect(jsonPath("$.[*].customConstraint").value(hasItem(DEFAULT_CUSTOM_CONSTRAINT.toString())));
    }

    @Test
    @Transactional
    public void getQualityControlStep() throws Exception {
        // Initialize the database
        qualityControlStepRepository.saveAndFlush(qualityControlStep);

        // Get the qualityControlStep
        restQualityControlStepMockMvc.perform(get("/api/quality-control-steps/{id}", qualityControlStep.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(qualityControlStep.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.feature").value(DEFAULT_FEATURE.toString()))
            .andExpect(jsonPath("$.customConstraint").value(DEFAULT_CUSTOM_CONSTRAINT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQualityControlStep() throws Exception {
        // Get the qualityControlStep
        restQualityControlStepMockMvc.perform(get("/api/quality-control-steps/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQualityControlStep() throws Exception {
        // Initialize the database
        qualityControlStepRepository.saveAndFlush(qualityControlStep);
        int databaseSizeBeforeUpdate = qualityControlStepRepository.findAll().size();

        // Update the qualityControlStep
        QualityControlStep updatedQualityControlStep = new QualityControlStep();
        updatedQualityControlStep.setId(qualityControlStep.getId());
        updatedQualityControlStep.setName(UPDATED_NAME);
        updatedQualityControlStep.setType(UPDATED_TYPE);
        updatedQualityControlStep.setFeature(UPDATED_FEATURE);
        updatedQualityControlStep.setCustomConstraint(UPDATED_CUSTOM_CONSTRAINT);

        restQualityControlStepMockMvc.perform(put("/api/quality-control-steps")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedQualityControlStep)))
                .andExpect(status().isOk());

        // Validate the QualityControlStep in the database
        List<QualityControlStep> qualityControlSteps = qualityControlStepRepository.findAll();
        assertThat(qualityControlSteps).hasSize(databaseSizeBeforeUpdate);
        QualityControlStep testQualityControlStep = qualityControlSteps.get(qualityControlSteps.size() - 1);
        assertThat(testQualityControlStep.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQualityControlStep.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testQualityControlStep.getFeature()).isEqualTo(UPDATED_FEATURE);
        assertThat(testQualityControlStep.getCustomConstraint()).isEqualTo(UPDATED_CUSTOM_CONSTRAINT);
    }

    @Test
    @Transactional
    public void deleteQualityControlStep() throws Exception {
        // Initialize the database
        qualityControlStepRepository.saveAndFlush(qualityControlStep);
        int databaseSizeBeforeDelete = qualityControlStepRepository.findAll().size();

        // Get the qualityControlStep
        restQualityControlStepMockMvc.perform(delete("/api/quality-control-steps/{id}", qualityControlStep.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<QualityControlStep> qualityControlSteps = qualityControlStepRepository.findAll();
        assertThat(qualityControlSteps).hasSize(databaseSizeBeforeDelete - 1);
    }
}

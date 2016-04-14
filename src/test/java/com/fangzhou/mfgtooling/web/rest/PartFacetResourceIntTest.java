package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.PartFacet;
import com.fangzhou.mfgtooling.repository.PartFacetRepository;

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

import com.fangzhou.mfgtooling.domain.enumeration.Facets;

/**
 * Test class for the PartFacetResource REST controller.
 *
 * @see PartFacetResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class PartFacetResourceIntTest {


    private static final Facets DEFAULT_NAME = Facets.LENGTH;
    private static final Facets UPDATED_NAME = Facets.WEIGHT;

    @Inject
    private PartFacetRepository partFacetRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restPartFacetMockMvc;

    private PartFacet partFacet;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        PartFacetResource partFacetResource = new PartFacetResource();
        ReflectionTestUtils.setField(partFacetResource, "partFacetRepository", partFacetRepository);
        this.restPartFacetMockMvc = MockMvcBuilders.standaloneSetup(partFacetResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        partFacet = new PartFacet();
        partFacet.setName(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void createPartFacet() throws Exception {
        int databaseSizeBeforeCreate = partFacetRepository.findAll().size();

        // Create the PartFacet

        restPartFacetMockMvc.perform(post("/api/part-facets")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(partFacet)))
                .andExpect(status().isCreated());

        // Validate the PartFacet in the database
        List<PartFacet> partFacets = partFacetRepository.findAll();
        assertThat(partFacets).hasSize(databaseSizeBeforeCreate + 1);
        PartFacet testPartFacet = partFacets.get(partFacets.size() - 1);
        assertThat(testPartFacet.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    public void getAllPartFacets() throws Exception {
        // Initialize the database
        partFacetRepository.saveAndFlush(partFacet);

        // Get all the partFacets
        restPartFacetMockMvc.perform(get("/api/part-facets?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(partFacet.getId().intValue())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getPartFacet() throws Exception {
        // Initialize the database
        partFacetRepository.saveAndFlush(partFacet);

        // Get the partFacet
        restPartFacetMockMvc.perform(get("/api/part-facets/{id}", partFacet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(partFacet.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingPartFacet() throws Exception {
        // Get the partFacet
        restPartFacetMockMvc.perform(get("/api/part-facets/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePartFacet() throws Exception {
        // Initialize the database
        partFacetRepository.saveAndFlush(partFacet);
        int databaseSizeBeforeUpdate = partFacetRepository.findAll().size();

        // Update the partFacet
        PartFacet updatedPartFacet = new PartFacet();
        updatedPartFacet.setId(partFacet.getId());
        updatedPartFacet.setName(UPDATED_NAME);

        restPartFacetMockMvc.perform(put("/api/part-facets")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedPartFacet)))
                .andExpect(status().isOk());

        // Validate the PartFacet in the database
        List<PartFacet> partFacets = partFacetRepository.findAll();
        assertThat(partFacets).hasSize(databaseSizeBeforeUpdate);
        PartFacet testPartFacet = partFacets.get(partFacets.size() - 1);
        assertThat(testPartFacet.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    public void deletePartFacet() throws Exception {
        // Initialize the database
        partFacetRepository.saveAndFlush(partFacet);
        int databaseSizeBeforeDelete = partFacetRepository.findAll().size();

        // Get the partFacet
        restPartFacetMockMvc.perform(delete("/api/part-facets/{id}", partFacet.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<PartFacet> partFacets = partFacetRepository.findAll();
        assertThat(partFacets).hasSize(databaseSizeBeforeDelete - 1);
    }
}

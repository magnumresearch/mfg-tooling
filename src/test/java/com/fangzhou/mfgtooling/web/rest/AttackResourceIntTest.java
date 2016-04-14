package com.fangzhou.mfgtooling.web.rest;

import com.fangzhou.mfgtooling.MfgtoolingApp;
import com.fangzhou.mfgtooling.domain.Attack;
import com.fangzhou.mfgtooling.repository.AttackRepository;

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

import com.fangzhou.mfgtooling.domain.enumeration.AttackType;

/**
 * Test class for the AttackResource REST controller.
 *
 * @see AttackResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = MfgtoolingApp.class)
@WebAppConfiguration
@IntegrationTest
public class AttackResourceIntTest {


    private static final AttackType DEFAULT_TYPE = AttackType.SCALING;
    private static final AttackType UPDATED_TYPE = AttackType.INDENTS;

    @Inject
    private AttackRepository attackRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restAttackMockMvc;

    private Attack attack;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        AttackResource attackResource = new AttackResource();
        ReflectionTestUtils.setField(attackResource, "attackRepository", attackRepository);
        this.restAttackMockMvc = MockMvcBuilders.standaloneSetup(attackResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        attack = new Attack();
        attack.setType(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    public void createAttack() throws Exception {
        int databaseSizeBeforeCreate = attackRepository.findAll().size();

        // Create the Attack

        restAttackMockMvc.perform(post("/api/attacks")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(attack)))
                .andExpect(status().isCreated());

        // Validate the Attack in the database
        List<Attack> attacks = attackRepository.findAll();
        assertThat(attacks).hasSize(databaseSizeBeforeCreate + 1);
        Attack testAttack = attacks.get(attacks.size() - 1);
        assertThat(testAttack.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    @Transactional
    public void getAllAttacks() throws Exception {
        // Initialize the database
        attackRepository.saveAndFlush(attack);

        // Get all the attacks
        restAttackMockMvc.perform(get("/api/attacks?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(attack.getId().intValue())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    @Transactional
    public void getAttack() throws Exception {
        // Initialize the database
        attackRepository.saveAndFlush(attack);

        // Get the attack
        restAttackMockMvc.perform(get("/api/attacks/{id}", attack.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(attack.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAttack() throws Exception {
        // Get the attack
        restAttackMockMvc.perform(get("/api/attacks/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAttack() throws Exception {
        // Initialize the database
        attackRepository.saveAndFlush(attack);
        int databaseSizeBeforeUpdate = attackRepository.findAll().size();

        // Update the attack
        Attack updatedAttack = new Attack();
        updatedAttack.setId(attack.getId());
        updatedAttack.setType(UPDATED_TYPE);

        restAttackMockMvc.perform(put("/api/attacks")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedAttack)))
                .andExpect(status().isOk());

        // Validate the Attack in the database
        List<Attack> attacks = attackRepository.findAll();
        assertThat(attacks).hasSize(databaseSizeBeforeUpdate);
        Attack testAttack = attacks.get(attacks.size() - 1);
        assertThat(testAttack.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    @Transactional
    public void deleteAttack() throws Exception {
        // Initialize the database
        attackRepository.saveAndFlush(attack);
        int databaseSizeBeforeDelete = attackRepository.findAll().size();

        // Get the attack
        restAttackMockMvc.perform(delete("/api/attacks/{id}", attack.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Attack> attacks = attackRepository.findAll();
        assertThat(attacks).hasSize(databaseSizeBeforeDelete - 1);
    }
}

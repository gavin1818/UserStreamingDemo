package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.OmegaApp;

import com.mycompany.myapp.domain.Demo;
import com.mycompany.myapp.repository.DemoRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the DemoResource REST controller.
 *
 * @see DemoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = OmegaApp.class)
public class DemoResourceIntTest {

    @Autowired
    private DemoRepository demoRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDemoMockMvc;

    private Demo demo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DemoResource demoResource = new DemoResource(demoRepository);
        this.restDemoMockMvc = MockMvcBuilders.standaloneSetup(demoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Demo createEntity(EntityManager em) {
        Demo demo = new Demo();
        return demo;
    }

    @Before
    public void initTest() {
        demo = createEntity(em);
    }

    @Test
    @Transactional
    public void createDemo() throws Exception {
        int databaseSizeBeforeCreate = demoRepository.findAll().size();

        // Create the Demo
        restDemoMockMvc.perform(post("/api/demos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(demo)))
            .andExpect(status().isCreated());

        // Validate the Demo in the database
        List<Demo> demoList = demoRepository.findAll();
        assertThat(demoList).hasSize(databaseSizeBeforeCreate + 1);
        Demo testDemo = demoList.get(demoList.size() - 1);
    }

    @Test
    @Transactional
    public void createDemoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = demoRepository.findAll().size();

        // Create the Demo with an existing ID
        demo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDemoMockMvc.perform(post("/api/demos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(demo)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Demo> demoList = demoRepository.findAll();
        assertThat(demoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDemos() throws Exception {
        // Initialize the database
        demoRepository.saveAndFlush(demo);

        // Get all the demoList
        restDemoMockMvc.perform(get("/api/demos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(demo.getId().intValue())));
    }

    @Test
    @Transactional
    public void getDemo() throws Exception {
        // Initialize the database
        demoRepository.saveAndFlush(demo);

        // Get the demo
        restDemoMockMvc.perform(get("/api/demos/{id}", demo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(demo.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingDemo() throws Exception {
        // Get the demo
        restDemoMockMvc.perform(get("/api/demos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDemo() throws Exception {
        // Initialize the database
        demoRepository.saveAndFlush(demo);
        int databaseSizeBeforeUpdate = demoRepository.findAll().size();

        // Update the demo
        Demo updatedDemo = demoRepository.findOne(demo.getId());

        restDemoMockMvc.perform(put("/api/demos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDemo)))
            .andExpect(status().isOk());

        // Validate the Demo in the database
        List<Demo> demoList = demoRepository.findAll();
        assertThat(demoList).hasSize(databaseSizeBeforeUpdate);
        Demo testDemo = demoList.get(demoList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingDemo() throws Exception {
        int databaseSizeBeforeUpdate = demoRepository.findAll().size();

        // Create the Demo

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDemoMockMvc.perform(put("/api/demos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(demo)))
            .andExpect(status().isCreated());

        // Validate the Demo in the database
        List<Demo> demoList = demoRepository.findAll();
        assertThat(demoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDemo() throws Exception {
        // Initialize the database
        demoRepository.saveAndFlush(demo);
        int databaseSizeBeforeDelete = demoRepository.findAll().size();

        // Get the demo
        restDemoMockMvc.perform(delete("/api/demos/{id}", demo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Demo> demoList = demoRepository.findAll();
        assertThat(demoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Demo.class);
    }
}

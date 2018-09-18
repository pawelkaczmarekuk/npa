package uk.gov.hmcts.reform.em.npa.web.rest;

import uk.gov.hmcts.reform.em.npa.NpaApp;

import uk.gov.hmcts.reform.em.npa.domain.DocumentTask;
import uk.gov.hmcts.reform.em.npa.repository.DocumentTaskRepository;
import uk.gov.hmcts.reform.em.npa.service.DocumentTaskService;
import uk.gov.hmcts.reform.em.npa.service.dto.DocumentTaskDTO;
import uk.gov.hmcts.reform.em.npa.service.mapper.DocumentTaskMapper;
import uk.gov.hmcts.reform.em.npa.web.rest.errors.ExceptionTranslator;

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


import static uk.gov.hmcts.reform.em.npa.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import uk.gov.hmcts.reform.em.npa.domain.enumeration.TaskState;
/**
 * Test class for the DocumentTaskResource REST controller.
 *
 * @see DocumentTaskResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = NpaApp.class)
public class DocumentTaskResourceIntTest {

    private static final String DEFAULT_INPUT_DOCUMENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_INPUT_DOCUMENT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_OUTPUT_DOCUMENT_ID = "AAAAAAAAAA";
    private static final String UPDATED_OUTPUT_DOCUMENT_ID = "BBBBBBBBBB";

    private static final TaskState DEFAULT_TASK_STATE = TaskState.NEW;
    private static final TaskState UPDATED_TASK_STATE = TaskState.IN_PROGRESS;

    private static final String DEFAULT_FAILURE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_FAILURE_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private DocumentTaskRepository documentTaskRepository;

    @Autowired
    private DocumentTaskMapper documentTaskMapper;
    
    @Autowired
    private DocumentTaskService documentTaskService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restDocumentTaskMockMvc;

    private DocumentTask documentTask;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final DocumentTaskResource documentTaskResource = new DocumentTaskResource(documentTaskService);
        this.restDocumentTaskMockMvc = MockMvcBuilders.standaloneSetup(documentTaskResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DocumentTask createEntity(EntityManager em) {
        DocumentTask documentTask = new DocumentTask()
            .inputDocumentId(DEFAULT_INPUT_DOCUMENT_ID)
            .outputDocumentId(DEFAULT_OUTPUT_DOCUMENT_ID)
            .taskState(DEFAULT_TASK_STATE)
            .failureDescription(DEFAULT_FAILURE_DESCRIPTION);
        return documentTask;
    }

    @Before
    public void initTest() {
        documentTask = createEntity(em);
    }

    @Test
    @Transactional
    public void createDocumentTask() throws Exception {
        int databaseSizeBeforeCreate = documentTaskRepository.findAll().size();

        // Create the DocumentTask
        DocumentTaskDTO documentTaskDTO = documentTaskMapper.toDto(documentTask);
        restDocumentTaskMockMvc.perform(post("/api/document-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentTaskDTO)))
            .andExpect(status().isCreated());

        // Validate the DocumentTask in the database
        List<DocumentTask> documentTaskList = documentTaskRepository.findAll();
        assertThat(documentTaskList).hasSize(databaseSizeBeforeCreate + 1);
        DocumentTask testDocumentTask = documentTaskList.get(documentTaskList.size() - 1);
        assertThat(testDocumentTask.getInputDocumentId()).isEqualTo(DEFAULT_INPUT_DOCUMENT_ID);
        assertThat(testDocumentTask.getOutputDocumentId()).isEqualTo(DEFAULT_OUTPUT_DOCUMENT_ID);
        assertThat(testDocumentTask.getTaskState()).isEqualTo(DEFAULT_TASK_STATE);
        assertThat(testDocumentTask.getFailureDescription()).isEqualTo(DEFAULT_FAILURE_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createDocumentTaskWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = documentTaskRepository.findAll().size();

        // Create the DocumentTask with an existing ID
        documentTask.setId(1L);
        DocumentTaskDTO documentTaskDTO = documentTaskMapper.toDto(documentTask);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDocumentTaskMockMvc.perform(post("/api/document-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentTaskDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentTask in the database
        List<DocumentTask> documentTaskList = documentTaskRepository.findAll();
        assertThat(documentTaskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllDocumentTasks() throws Exception {
        // Initialize the database
        documentTaskRepository.saveAndFlush(documentTask);

        // Get all the documentTaskList
        restDocumentTaskMockMvc.perform(get("/api/document-tasks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(documentTask.getId().intValue())))
            .andExpect(jsonPath("$.[*].inputDocumentId").value(hasItem(DEFAULT_INPUT_DOCUMENT_ID.toString())))
            .andExpect(jsonPath("$.[*].outputDocumentId").value(hasItem(DEFAULT_OUTPUT_DOCUMENT_ID.toString())))
            .andExpect(jsonPath("$.[*].taskState").value(hasItem(DEFAULT_TASK_STATE.toString())))
            .andExpect(jsonPath("$.[*].failureDescription").value(hasItem(DEFAULT_FAILURE_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getDocumentTask() throws Exception {
        // Initialize the database
        documentTaskRepository.saveAndFlush(documentTask);

        // Get the documentTask
        restDocumentTaskMockMvc.perform(get("/api/document-tasks/{id}", documentTask.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(documentTask.getId().intValue()))
            .andExpect(jsonPath("$.inputDocumentId").value(DEFAULT_INPUT_DOCUMENT_ID.toString()))
            .andExpect(jsonPath("$.outputDocumentId").value(DEFAULT_OUTPUT_DOCUMENT_ID.toString()))
            .andExpect(jsonPath("$.taskState").value(DEFAULT_TASK_STATE.toString()))
            .andExpect(jsonPath("$.failureDescription").value(DEFAULT_FAILURE_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDocumentTask() throws Exception {
        // Get the documentTask
        restDocumentTaskMockMvc.perform(get("/api/document-tasks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDocumentTask() throws Exception {
        // Initialize the database
        documentTaskRepository.saveAndFlush(documentTask);

        int databaseSizeBeforeUpdate = documentTaskRepository.findAll().size();

        // Update the documentTask
        DocumentTask updatedDocumentTask = documentTaskRepository.findById(documentTask.getId()).get();
        // Disconnect from session so that the updates on updatedDocumentTask are not directly saved in db
        em.detach(updatedDocumentTask);
        updatedDocumentTask
            .inputDocumentId(UPDATED_INPUT_DOCUMENT_ID)
            .outputDocumentId(UPDATED_OUTPUT_DOCUMENT_ID)
            .taskState(UPDATED_TASK_STATE)
            .failureDescription(UPDATED_FAILURE_DESCRIPTION);
        DocumentTaskDTO documentTaskDTO = documentTaskMapper.toDto(updatedDocumentTask);

        restDocumentTaskMockMvc.perform(put("/api/document-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentTaskDTO)))
            .andExpect(status().isOk());

        // Validate the DocumentTask in the database
        List<DocumentTask> documentTaskList = documentTaskRepository.findAll();
        assertThat(documentTaskList).hasSize(databaseSizeBeforeUpdate);
        DocumentTask testDocumentTask = documentTaskList.get(documentTaskList.size() - 1);
        assertThat(testDocumentTask.getInputDocumentId()).isEqualTo(UPDATED_INPUT_DOCUMENT_ID);
        assertThat(testDocumentTask.getOutputDocumentId()).isEqualTo(UPDATED_OUTPUT_DOCUMENT_ID);
        assertThat(testDocumentTask.getTaskState()).isEqualTo(UPDATED_TASK_STATE);
        assertThat(testDocumentTask.getFailureDescription()).isEqualTo(UPDATED_FAILURE_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingDocumentTask() throws Exception {
        int databaseSizeBeforeUpdate = documentTaskRepository.findAll().size();

        // Create the DocumentTask
        DocumentTaskDTO documentTaskDTO = documentTaskMapper.toDto(documentTask);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDocumentTaskMockMvc.perform(put("/api/document-tasks")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(documentTaskDTO)))
            .andExpect(status().isBadRequest());

        // Validate the DocumentTask in the database
        List<DocumentTask> documentTaskList = documentTaskRepository.findAll();
        assertThat(documentTaskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDocumentTask() throws Exception {
        // Initialize the database
        documentTaskRepository.saveAndFlush(documentTask);

        int databaseSizeBeforeDelete = documentTaskRepository.findAll().size();

        // Get the documentTask
        restDocumentTaskMockMvc.perform(delete("/api/document-tasks/{id}", documentTask.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<DocumentTask> documentTaskList = documentTaskRepository.findAll();
        assertThat(documentTaskList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentTask.class);
        DocumentTask documentTask1 = new DocumentTask();
        documentTask1.setId(1L);
        DocumentTask documentTask2 = new DocumentTask();
        documentTask2.setId(documentTask1.getId());
        assertThat(documentTask1).isEqualTo(documentTask2);
        documentTask2.setId(2L);
        assertThat(documentTask1).isNotEqualTo(documentTask2);
        documentTask1.setId(null);
        assertThat(documentTask1).isNotEqualTo(documentTask2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DocumentTaskDTO.class);
        DocumentTaskDTO documentTaskDTO1 = new DocumentTaskDTO();
        documentTaskDTO1.setId(1L);
        DocumentTaskDTO documentTaskDTO2 = new DocumentTaskDTO();
        assertThat(documentTaskDTO1).isNotEqualTo(documentTaskDTO2);
        documentTaskDTO2.setId(documentTaskDTO1.getId());
        assertThat(documentTaskDTO1).isEqualTo(documentTaskDTO2);
        documentTaskDTO2.setId(2L);
        assertThat(documentTaskDTO1).isNotEqualTo(documentTaskDTO2);
        documentTaskDTO1.setId(null);
        assertThat(documentTaskDTO1).isNotEqualTo(documentTaskDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(documentTaskMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(documentTaskMapper.fromId(null)).isNull();
    }
}

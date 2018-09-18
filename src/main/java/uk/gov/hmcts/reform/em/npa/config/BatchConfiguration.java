package uk.gov.hmcts.reform.em.npa.config;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.JdbcCursorItemReader;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.database.builder.JdbcCursorItemReaderBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uk.gov.hmcts.reform.em.npa.batch.DocumentTaskItemProcessor;
import uk.gov.hmcts.reform.em.npa.domain.DocumentTask;
import uk.gov.hmcts.reform.em.npa.domain.enumeration.TaskState;

import javax.sql.DataSource;

@EnableBatchProcessing
@Configuration
public class BatchConfiguration {

    @Autowired
    public JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Bean
    public JdbcCursorItemReader<DocumentTask> reader(DataSource dataSource) {
        return new JdbcCursorItemReaderBuilder<DocumentTask>()
            .name("jdbc-task-reader")
            .dataSource(dataSource)
            .sql("select id, input_document_id, output_document_id, task_state, failure_description, created_by, created_date, " +
                "last_modified_by, last_modified_date from document_task where task_state='NEW'")
            .rowMapper((rs, i) -> {
                DocumentTask documentTask = new DocumentTask();
                documentTask.setId(rs.getLong("id"));
                documentTask.setInputDocumentId(rs.getString("input_document_id"));
                documentTask.setOutputDocumentId(rs.getString("output_document_id"));
                documentTask.setTaskState(TaskState.valueOf(rs.getString("task_state")));
                return documentTask;
            })
            .build();
    }

    @Bean
    public DocumentTaskItemProcessor processor() {
        return new DocumentTaskItemProcessor();
    }

    @Bean
    public JdbcBatchItemWriter<DocumentTask> writer(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<DocumentTask>()
            .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
            .sql("update document_task set task_state = :task_state where id = :id")
            .dataSource(dataSource)
            .build();
    }

    //JobCompletionNotificationListener listener,
    @Bean
    public Job processDocument(Step step1) {
        return jobBuilderFactory.get("processDocumentJob")
            .incrementer(new RunIdIncrementer())
            //.listener(listener)
            .flow(step1)
            .end()
            .build();
    }

    @Bean
    public Step step1(JdbcBatchItemWriter<DocumentTask> writer, DataSource dataSource) {
        return stepBuilderFactory.get("step1")
            .<DocumentTask, DocumentTask> chunk(10)
            .reader(reader(dataSource))
            .processor(processor())
            .writer(writer)
            .build();
    }

}

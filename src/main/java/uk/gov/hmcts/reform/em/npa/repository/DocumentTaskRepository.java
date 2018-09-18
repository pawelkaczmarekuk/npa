package uk.gov.hmcts.reform.em.npa.repository;

import uk.gov.hmcts.reform.em.npa.domain.DocumentTask;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the DocumentTask entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DocumentTaskRepository extends JpaRepository<DocumentTask, Long> {

}

package uk.gov.hmcts.reform.em.npa.service.mapper;

import uk.gov.hmcts.reform.em.npa.domain.*;
import uk.gov.hmcts.reform.em.npa.service.dto.DocumentTaskDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity DocumentTask and its DTO DocumentTaskDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DocumentTaskMapper extends EntityMapper<DocumentTaskDTO, DocumentTask> {



    default DocumentTask fromId(Long id) {
        if (id == null) {
            return null;
        }
        DocumentTask documentTask = new DocumentTask();
        documentTask.setId(id);
        return documentTask;
    }
}

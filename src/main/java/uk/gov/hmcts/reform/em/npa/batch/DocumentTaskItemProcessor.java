package uk.gov.hmcts.reform.em.npa.batch;

import org.springframework.batch.item.ItemProcessor;
import uk.gov.hmcts.reform.em.npa.domain.DocumentTask;

public class DocumentTaskItemProcessor implements ItemProcessor<DocumentTask, DocumentTask> {

    @Override
    public DocumentTask process(DocumentTask item) {

        //download a file file (s2s)
        //produce a new pdf (//fetch annotation set (jwt key))
        //upload to DM (s2s)

        System.out.println("Processing item + " + item);
        return item;
    }

}

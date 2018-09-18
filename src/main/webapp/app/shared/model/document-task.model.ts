export const enum TaskState {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    FAILED = 'FAILED'
}

export interface IDocumentTask {
    id?: number;
    inputDocumentId?: string;
    outputDocumentId?: string;
    taskState?: TaskState;
    failureDescription?: string;
}

export class DocumentTask implements IDocumentTask {
    constructor(
        public id?: number,
        public inputDocumentId?: string,
        public outputDocumentId?: string,
        public taskState?: TaskState,
        public failureDescription?: string
    ) {}
}

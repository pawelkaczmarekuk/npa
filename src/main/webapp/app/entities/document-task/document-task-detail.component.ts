import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumentTask } from 'app/shared/model/document-task.model';

@Component({
    selector: 'jhi-document-task-detail',
    templateUrl: './document-task-detail.component.html'
})
export class DocumentTaskDetailComponent implements OnInit {
    documentTask: IDocumentTask;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ documentTask }) => {
            this.documentTask = documentTask;
        });
    }

    previousState() {
        window.history.back();
    }
}

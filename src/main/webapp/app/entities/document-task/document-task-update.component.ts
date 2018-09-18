import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IDocumentTask } from 'app/shared/model/document-task.model';
import { DocumentTaskService } from './document-task.service';

@Component({
    selector: 'jhi-document-task-update',
    templateUrl: './document-task-update.component.html'
})
export class DocumentTaskUpdateComponent implements OnInit {
    private _documentTask: IDocumentTask;
    isSaving: boolean;

    constructor(private documentTaskService: DocumentTaskService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ documentTask }) => {
            this.documentTask = documentTask;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.documentTask.id !== undefined) {
            this.subscribeToSaveResponse(this.documentTaskService.update(this.documentTask));
        } else {
            this.subscribeToSaveResponse(this.documentTaskService.create(this.documentTask));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IDocumentTask>>) {
        result.subscribe((res: HttpResponse<IDocumentTask>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get documentTask() {
        return this._documentTask;
    }

    set documentTask(documentTask: IDocumentTask) {
        this._documentTask = documentTask;
    }
}

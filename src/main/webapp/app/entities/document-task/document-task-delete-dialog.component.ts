import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDocumentTask } from 'app/shared/model/document-task.model';
import { DocumentTaskService } from './document-task.service';

@Component({
    selector: 'jhi-document-task-delete-dialog',
    templateUrl: './document-task-delete-dialog.component.html'
})
export class DocumentTaskDeleteDialogComponent {
    documentTask: IDocumentTask;

    constructor(
        private documentTaskService: DocumentTaskService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.documentTaskService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'documentTaskListModification',
                content: 'Deleted an documentTask'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-document-task-delete-popup',
    template: ''
})
export class DocumentTaskDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ documentTask }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(DocumentTaskDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.documentTask = documentTask;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}

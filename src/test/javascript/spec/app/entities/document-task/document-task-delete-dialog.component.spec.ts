/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { NpaTestModule } from '../../../test.module';
import { DocumentTaskDeleteDialogComponent } from 'app/entities/document-task/document-task-delete-dialog.component';
import { DocumentTaskService } from 'app/entities/document-task/document-task.service';

describe('Component Tests', () => {
    describe('DocumentTask Management Delete Component', () => {
        let comp: DocumentTaskDeleteDialogComponent;
        let fixture: ComponentFixture<DocumentTaskDeleteDialogComponent>;
        let service: DocumentTaskService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NpaTestModule],
                declarations: [DocumentTaskDeleteDialogComponent]
            })
                .overrideTemplate(DocumentTaskDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DocumentTaskDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DocumentTaskService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});

/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { NpaTestModule } from '../../../test.module';
import { DocumentTaskUpdateComponent } from 'app/entities/document-task/document-task-update.component';
import { DocumentTaskService } from 'app/entities/document-task/document-task.service';
import { DocumentTask } from 'app/shared/model/document-task.model';

describe('Component Tests', () => {
    describe('DocumentTask Management Update Component', () => {
        let comp: DocumentTaskUpdateComponent;
        let fixture: ComponentFixture<DocumentTaskUpdateComponent>;
        let service: DocumentTaskService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NpaTestModule],
                declarations: [DocumentTaskUpdateComponent]
            })
                .overrideTemplate(DocumentTaskUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DocumentTaskUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DocumentTaskService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new DocumentTask(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.documentTask = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new DocumentTask();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.documentTask = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});

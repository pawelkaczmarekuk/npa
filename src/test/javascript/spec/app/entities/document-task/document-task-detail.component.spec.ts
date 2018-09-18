/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NpaTestModule } from '../../../test.module';
import { DocumentTaskDetailComponent } from 'app/entities/document-task/document-task-detail.component';
import { DocumentTask } from 'app/shared/model/document-task.model';

describe('Component Tests', () => {
    describe('DocumentTask Management Detail Component', () => {
        let comp: DocumentTaskDetailComponent;
        let fixture: ComponentFixture<DocumentTaskDetailComponent>;
        const route = ({ data: of({ documentTask: new DocumentTask(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NpaTestModule],
                declarations: [DocumentTaskDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(DocumentTaskDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(DocumentTaskDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.documentTask).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});

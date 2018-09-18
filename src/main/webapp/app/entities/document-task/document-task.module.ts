import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NpaSharedModule } from 'app/shared';
import {
    DocumentTaskComponent,
    DocumentTaskDetailComponent,
    DocumentTaskUpdateComponent,
    DocumentTaskDeletePopupComponent,
    DocumentTaskDeleteDialogComponent,
    documentTaskRoute,
    documentTaskPopupRoute
} from './';

const ENTITY_STATES = [...documentTaskRoute, ...documentTaskPopupRoute];

@NgModule({
    imports: [NpaSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DocumentTaskComponent,
        DocumentTaskDetailComponent,
        DocumentTaskUpdateComponent,
        DocumentTaskDeleteDialogComponent,
        DocumentTaskDeletePopupComponent
    ],
    entryComponents: [
        DocumentTaskComponent,
        DocumentTaskUpdateComponent,
        DocumentTaskDeleteDialogComponent,
        DocumentTaskDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NpaDocumentTaskModule {}

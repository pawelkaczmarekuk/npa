import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentTask } from 'app/shared/model/document-task.model';
import { DocumentTaskService } from './document-task.service';
import { DocumentTaskComponent } from './document-task.component';
import { DocumentTaskDetailComponent } from './document-task-detail.component';
import { DocumentTaskUpdateComponent } from './document-task-update.component';
import { DocumentTaskDeletePopupComponent } from './document-task-delete-dialog.component';
import { IDocumentTask } from 'app/shared/model/document-task.model';

@Injectable({ providedIn: 'root' })
export class DocumentTaskResolve implements Resolve<IDocumentTask> {
    constructor(private service: DocumentTaskService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((documentTask: HttpResponse<DocumentTask>) => documentTask.body));
        }
        return of(new DocumentTask());
    }
}

export const documentTaskRoute: Routes = [
    {
        path: 'document-task',
        component: DocumentTaskComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'DocumentTasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'document-task/:id/view',
        component: DocumentTaskDetailComponent,
        resolve: {
            documentTask: DocumentTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'DocumentTasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'document-task/new',
        component: DocumentTaskUpdateComponent,
        resolve: {
            documentTask: DocumentTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'DocumentTasks'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'document-task/:id/edit',
        component: DocumentTaskUpdateComponent,
        resolve: {
            documentTask: DocumentTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'DocumentTasks'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const documentTaskPopupRoute: Routes = [
    {
        path: 'document-task/:id/delete',
        component: DocumentTaskDeletePopupComponent,
        resolve: {
            documentTask: DocumentTaskResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'DocumentTasks'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IDocumentTask } from 'app/shared/model/document-task.model';

type EntityResponseType = HttpResponse<IDocumentTask>;
type EntityArrayResponseType = HttpResponse<IDocumentTask[]>;

@Injectable({ providedIn: 'root' })
export class DocumentTaskService {
    private resourceUrl = SERVER_API_URL + 'api/document-tasks';

    constructor(private http: HttpClient) {}

    create(documentTask: IDocumentTask): Observable<EntityResponseType> {
        return this.http.post<IDocumentTask>(this.resourceUrl, documentTask, { observe: 'response' });
    }

    update(documentTask: IDocumentTask): Observable<EntityResponseType> {
        return this.http.put<IDocumentTask>(this.resourceUrl, documentTask, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IDocumentTask>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IDocumentTask[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}

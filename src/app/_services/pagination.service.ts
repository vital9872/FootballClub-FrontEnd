import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Page } from '@app/_models/page';
import { PageableParameters } from '@app/_models/Pagination/pageableParameters';
import { CompletePaginationParams } from '@app/_models/Pagination/completePaginationParameters';



@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor(private http: HttpClient) { }
  getPaginatedPage<T>(getUrl: string, paginationParameters: CompletePaginationParams): Observable<Page<T>> {
    let params = new HttpParams();
    params = paginationParameters.getHttpParams();
    return this.http.get<Page<T>>(getUrl, { params });
  }
  getPage<T>(getUrl: string, pagination: PageableParameters): Observable<Page<T>> {
    let params = new HttpParams();
    params = pagination.mapPagination(params, pagination);
    return this.http.get<Page<T>>(getUrl, { params });
  }

}

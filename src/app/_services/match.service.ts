import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Match } from '@app/_models/match';

@Injectable({ providedIn: 'root' })
export class MatchService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public match: Match;

    getAll(params) {
        return this.paginationService.getPaginatedPage<Match>(`${environment.apiUrl}/match/paginated`, params);
    }

    getById(id: number) {
        return this.http.get<Match>(`${environment.apiUrl}/match/${id}`);
    }

    post(matchToCreate:Match){
        return this.http.post<Match>(`${environment.apiUrl}/match`, matchToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    put(matchToEdit:Match){
        return this.http.put<Match>(`${environment.apiUrl}/match`, matchToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<Match>(`${environment.apiUrl}/match/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
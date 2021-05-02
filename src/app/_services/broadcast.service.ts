import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { MatchBroadcast } from '@app/_models/matchBroadcast';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class BroadcastService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public broadcast: MatchBroadcast;

    getAll(params) {
        return this.paginationService.getPaginatedPage<MatchBroadcast>(`${environment.apiUrl}/broadcasts/paginated`, params);
    }

    getById(id: number) {
        return this.http.get<MatchBroadcast>(`${environment.apiUrl}/broadcasts/${id}`);
    }

    post(broadcastToCreate:MatchBroadcast){
        return this.http.post<MatchBroadcast>(`${environment.apiUrl}/broadcasts`, broadcastToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    put(broadcastToEdit:MatchBroadcast){
        return this.http.put<MatchBroadcast>(`${environment.apiUrl}/broadcasts`, broadcastToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<MatchBroadcast>(`${environment.apiUrl}/broadcasts/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { Player } from '@app/_models/player';
import { PaginationService } from './pagination.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public player: Player;

    getAllWithoutParams() {
        return this.http.get<any>(`${environment.apiUrl}/players`);
    }

    getAll(params) {
        return this.paginationService.getPaginatedPage<Player>(`${environment.apiUrl}/players/paginated`, params);
        //return this.http.get<any[]>(`${environment.apiUrl}/players`);
    }

    getById(id: number) {
        return this.http.get<Player>(`${environment.apiUrl}/players/${id}`);
    }

    post(playerToCreate:Player){
        console.log(playerToCreate);
        return this.http.post<Player>(`${environment.apiUrl}/players`, playerToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    put(playerToEdit:Player){
        return this.http.put<Player>(`${environment.apiUrl}/players`, playerToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<Player>(`${environment.apiUrl}/players/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
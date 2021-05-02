import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Match } from '@app/_models/match';
import { PlayerMatches } from '@app/_models/playerMatches';

@Injectable({ providedIn: 'root' })
export class PlayerMatchesService {
    constructor(private http: HttpClient) { }

    getById(id: number) {
        return this.http.get<PlayerMatches>(`${environment.apiUrl}/playerMatches/${id}`);
    }

    post(matchToCreate:PlayerMatches){
        return this.http.post<PlayerMatches>(`${environment.apiUrl}/playerMatches`, matchToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    delete(matchToDelete: PlayerMatches){          
        return this.http.post<PlayerMatches>(`${environment.apiUrl}/playerMatches/1`, matchToDelete).
            pipe(map(p => {
                return p;
            }));
    }

    
}
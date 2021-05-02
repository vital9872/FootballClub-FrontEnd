import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Match } from '@app/_models/match';
import { PlayerTraining } from '@app/_models/playerTraining';

@Injectable({ providedIn: 'root' })
export class PlayerTrainingService {
    constructor(private http: HttpClient) { }

    getById(id: number) {
        return this.http.get<PlayerTraining>(`${environment.apiUrl}/playerTraining/${id}`);
    }

    post(matchToCreate:PlayerTraining){
        return this.http.post<PlayerTraining>(`${environment.apiUrl}/playerTraining`, matchToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    delete(matchToDelete: PlayerTraining){          
        return this.http.post<PlayerTraining>(`${environment.apiUrl}/playerTraining/1`, matchToDelete).
            pipe(map(p => {
                return p;
            }));
    }

    
}
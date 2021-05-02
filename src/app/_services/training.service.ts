import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Training } from '@app/_models/training';

@Injectable({ providedIn: 'root' })
export class TrainingService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public training: Training;

    getAll(params) {
        return this.paginationService.getPaginatedPage<Training>(`${environment.apiUrl}/training/paginated`, params);
    }

    getById(id: number) {
        return this.http.get<Training>(`${environment.apiUrl}/training/${id}`);
    }

    post(trainingToCreate:Training){
        return this.http.post<Training>(`${environment.apiUrl}/training`, trainingToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    put(trainingToEdit:Training){
        return this.http.put<Training>(`${environment.apiUrl}/training`, trainingToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<Training>(`${environment.apiUrl}/training/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Income } from '@app/_models/income';

@Injectable({ providedIn: 'root' })
export class IncomeService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public income: Income;

    getAll(params) {
        return this.paginationService.getPaginatedPage<Income>(`${environment.apiUrl}/income/paginated`, params);
    }

    getById(id: number) {
        return this.http.get<Income>(`${environment.apiUrl}/income/${id}`);
    }

    post(incomeToCreate:Income){
        return this.http.post<Income>(`${environment.apiUrl}/income`, incomeToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    
    postPlayerIncome(){
        return this.http.post<Income>(`${environment.apiUrl}/income/player`, '')
            .pipe(map(p => {
                return p;
            }));
    }

    postMatchIncome(){
        return this.http.post<Income>(`${environment.apiUrl}/income/match`, '')
            .pipe(map(p => {
                return p;
            }));
    }

    put(incomeToEdit:Income){
        return this.http.put<Income>(`${environment.apiUrl}/income`, incomeToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<Income>(`${environment.apiUrl}/income/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
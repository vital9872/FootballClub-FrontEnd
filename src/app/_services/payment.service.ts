import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginationService } from './pagination.service';
import { environment } from '@environments/environment';
import { Payment } from '@app/_models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    constructor(private http: HttpClient, private paginationService: PaginationService) { }

    public payment: Payment;

    getAll(params) {
        return this.paginationService.getPaginatedPage<Payment>(`${environment.apiUrl}/payment/paginated`, params);
    }

    getById(id: number) {
        return this.http.get<Payment>(`${environment.apiUrl}/payment/${id}`);
    }

    post(paymentToCreate:Payment){
        return this.http.post<Payment>(`${environment.apiUrl}/payment`, paymentToCreate)
            .pipe(map(p => {
                return p;
            }));
    }

    
    postPlayerPayment(){
        return this.http.post<Payment>(`${environment.apiUrl}/payment/player`, '')
            .pipe(map(p => {
                return p;
            }));
    }

    postMatchPayment(){
        return this.http.post<Payment>(`${environment.apiUrl}/payment/match`, '')
            .pipe(map(p => {
                return p;
            }));
    }

    put(paymentToEdit:Payment){
        return this.http.put<Payment>(`${environment.apiUrl}/payment`, paymentToEdit)
        .pipe(map(p => {
            return p;
        }));
    }

    delete(id: number){
        return this.http.delete<Payment>(`${environment.apiUrl}/payment/${id}`).
            pipe(map(p => {
                return p;
            }));
    }

    
}
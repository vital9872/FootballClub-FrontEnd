import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    public userToEdit: User;

    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    getByUserName(username: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${username}`);
    }

    create(userToCreate:User){
        console.log(userToCreate);
        return this.http.post<any>(`${environment.apiUrl}/users`, userToCreate)
            .pipe(map(user => {
                return user;
            }));
    }

    edit(userToEdit:User){
        return this.http.put<User>(`${environment.apiUrl}/users`, userToEdit)
        .pipe(map(user => {
            return user;
        }));
    }

    delete(username: string){
        return this.http.delete<User>(`${environment.apiUrl}/users/${username}`).
            pipe(map(user => {
                return user;
            }));
    }

}
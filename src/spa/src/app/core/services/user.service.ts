import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiRoot}`;

  constructor(private http: HttpClient) { }

  get user$(): Observable<User> {
    return localStorage.getItem('user')
      ? of(JSON.parse(localStorage.getItem('user') ?? ''))
      : this.http.get<User>(`${this.apiUrl}/users/@me`).pipe(tap(user =>
        localStorage.setItem('user', JSON.stringify(user))
      ));
  }
}

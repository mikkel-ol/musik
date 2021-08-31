import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiRoot}`;

  constructor(private router: Router, private http: HttpClient) { }

  login() {
    return of(window.location.href = `${environment.apiRoot}/auth?returnTo=${window.location.origin}/auth/callback`);
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, null).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    })
  }
}
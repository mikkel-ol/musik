import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Ignore requests outside API domain
    if (!request.url.startsWith(environment.apiRoot)) {
      return next.handle(request);
    }

    // Attach cookies to requests
    request = request.clone({
      withCredentials: true,
    });

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.router.navigate(["/"])
          return EMPTY;
        }

        return throwError(err);
      })
    );
  }
}

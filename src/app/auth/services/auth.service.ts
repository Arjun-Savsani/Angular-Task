import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export interface SignupCredentials {
  username: string;
  password: string;
  passwordConfirmation: string;
}

export interface SigninCredentials {
  username: string;
  password: string;
}

interface SignupResponse {
  username: string;
}

interface SignedinResponse {
  authenticated: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  rootUrl = 'http://124.123.123.91:20080/api/v1/login';
  signedin$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  usernameAvailable(username: string) {
    return this.http.post<{ available: boolean }>(`${this.rootUrl}`, {
      username,
    });
  }

  signup(credentials: SignupCredentials) {
    return this.http.post<SignupResponse>(`${this.rootUrl}`, credentials).pipe(
      tap(() => {
        this.signedin$.next(true);
      })
    );
  }

  checkAuth() {
    return this.http.get<SignedinResponse>(`${this.rootUrl}`).pipe(
      tap(({ authenticated }) => {
        this.signedin$.next(authenticated);
      })
    );
  }

  signout() {
    return this.http.post(`${this.rootUrl}`, {}).pipe(
      tap(() => {
        this.signedin$.next(false);
      })
    );
  }

  signin(credentials: SigninCredentials) {
    return this.http
      .post<SigninCredentials>(`${this.rootUrl}`, credentials)
      .pipe(tap(() => this.signedin$.next(true)));
  }
}

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpResponse } from '../Models/sign-up-response';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../Models/User';
import { ErrorMsg } from '../Enums/error-msg';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  apiKey: string = 'AIzaSyA_wp4MkMeKINHfHxlQ_jWKtzpWmEj2smY';
  urlEndPoint: string = "https://identitytoolkit.googleapis.com/v1/accounts:";

  us!: User;
  userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.us);

  logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string): Observable<SignUpResponse>
  {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<SignUpResponse>(this.urlEndPoint+"signUp?key="+this.apiKey,data,{headers:{'Content-Type': 'application/json'}})
    .pipe(catchError(this.handleError), tap((data) => {
      this.handleCreateUser(data);
    }));
  }

  login(email: string, password: string): Observable<SignUpResponse>
  {
    const data = { email: email, password: password, returnSecureToken:true};
    return this.http.post<SignUpResponse>(this.urlEndPoint+"signInWithPassword?key="+this.apiKey,data,{headers:{'Content-Type': 'application/json'}}).
    pipe(catchError(this.handleError), tap((data) => {
      this.handleCreateUser(data);
    }));
  }

  logOut(): void{
    localStorage.removeItem('user');
    this.userSubject.next(this.us);
    this.router.navigate(['/Login']);
  }

  autoLogout(expireTime: number): void{
    this.logoutTimer = setTimeout(() => {this.logOut()}, expireTime);
  }

  autoLoggedIn(): void{
    const user = localStorage.getItem('user');
    let final_user;
    if(user != null)
      {
        final_user = JSON.parse(user);
      }
    if(!final_user)
      {
        return;
      }
      const loggedUser = new User(final_user.email, final_user.id, final_user._token,final_user._expiresIn);
      if(loggedUser.token != '')
        {
          this.userSubject.next(loggedUser);
          const timerValue = (new Date(final_user._expiresIn).getTime()) - (new Date().getTime());
          this.autoLogout(timerValue);
        }
  }

  private handleCreateUser(data: SignUpResponse){
    const expiresInTs = new Date().getTime()+ +data.expiresIn *1000;
    const expiresIn = new Date(expiresInTs);
    const user = new User(data.email,data.localId,data.idToken,expiresIn);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
    this.autoLogout(+data.expiresIn * 1000);
  }

 private handleError(err:HttpErrorResponse)
 {
  let errMsg =  ErrorMsg[<keyof typeof ErrorMsg>err.error.error.message]
  return throwError(errMsg);
 }
}

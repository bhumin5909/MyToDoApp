import { User } from './../Models/User';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthserviceService } from "./authservice.service";
import { inject } from "@angular/core";

export class InterceptorService implements HttpInterceptor {
  authserv: AuthserviceService = inject(AuthserviceService);
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authserv.userSubject.pipe(take(1),exhaustMap((user) => {
      if(!user)
        {
          return next.handle(req);
        }
        const modifiedReq = req.clone({params: new HttpParams().set('auth',user.token)});
        return next.handle(modifiedReq);
      }
    ))
  }
}

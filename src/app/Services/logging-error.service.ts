import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Errors } from '../Models/errors';

@Injectable({
  providedIn: 'root'
})
export class LoggingErrorService {

  constructor() { }

  http: HttpClient = inject(HttpClient);

  logData(data:Errors):void{
    this.http.post("https://angularhttpclient-95947-default-rtdb.asia-southeast1.firebasedatabase.app/erros.json",data).subscribe();
  }
}

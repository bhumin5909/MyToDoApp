import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Task } from '../Models/task';
import { Subject, catchError, map, tap, throwError } from 'rxjs';
import { LoggingErrorService } from './logging-error.service';
import { AuthserviceService } from './authservice.service';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})

export class FirebaseDataService {

  user!: User;
  constructor(private http: HttpClient, private logService: LoggingErrorService, private authserv:AuthserviceService) {
    this.authserv.userSubject.subscribe(user => {
      this.user = user;
    });
   }

  firebaseSubject: Subject<Task[]> = new Subject();

  uploadData(id: string | undefined, data: Task,updateData?:boolean): void {
    let header = new HttpHeaders({ 'myName': 'Bhumin' });
    if (id != undefined) {
      this.http.put("https://angularhttpclient-95947-default-rtdb.asia-southeast1.firebasedatabase.app/users/"+this.user.id+"/data/" + id + ".json", data).
      pipe(
        catchError((error: HttpErrorResponse) => {
          this.logService.logData({
            errorCode: error.status,
            errorMessage: error.message,
            date: new Date()});
            return throwError(() => error)
        })).subscribe();
        if(updateData)
          {
            setTimeout(() => { this.getAllData() }, 1000);
          }
    }
    else {
      this.http.post<{ name: String }>("https://angularhttpclient-95947-default-rtdb.asia-southeast1.firebasedatabase.app/users/"+this.user.id+"/data.json", data, { headers: header }).pipe(
        catchError((error: HttpErrorResponse) => {
          this.logService.logData({
            errorCode: error.status,
            errorMessage: error.message,
            date: new Date()});
          return throwError(() => error)
        })).subscribe();
        setTimeout(() => { this.getAllData() }, 1000);
      }
  }

  getAllData(): void {
    this.http.get<Task[]>("https://angularhttpclient-95947-default-rtdb.asia-southeast1.firebasedatabase.app/users/"+this.user.id+"/data.json")
      .pipe(map((response) => {
        let task = [];
        for (let key in response) {
          if (response.hasOwnProperty(key)) {
            task.push({ ...response[key], id: key });
          }
        }
        return task;
      }),
        catchError((error: HttpErrorResponse) => {
          this.logService.logData({
            errorCode: error.status,
            errorMessage: error.message,
            date: new Date()
          }); return throwError(() => error)
        })
      ).subscribe({
        next: (data: Task[]) => {
          this.firebaseSubject.next(data);
        },
        error: (error) => {
          this.firebaseSubject.error(error);
        }
      });
  }

  editTaskSubject: Subject<Task> = new Subject<Task>();

  EditTask(tk: Task): void {
    this.editTaskSubject.next(tk);
  }

  taskDisSubject: Subject<Task> = new Subject<Task>();

  taskToDisplay(task: Task): void {
    this.taskDisSubject.next(task);
  }

  deleteTask(id: string): void {
    this.http.delete<Task>("https://angularhttpclient-95947-default-rtdb.asia-southeast1.firebasedatabase.app/users/"+this.user.id+"/data/" + id + ".json", { observe: 'events' }).
    pipe( catchError((error: HttpErrorResponse) => {
        this.logService.logData({
          errorCode: error.status,
          errorMessage: error.message,
          date: new Date()});
        return throwError(() => error)})).subscribe();

    setTimeout(() => { this.getAllData();}, 1000);
  }

}

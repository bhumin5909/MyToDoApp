import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthserviceService } from './Services/authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyToDoApp';
  isLoggedIn: boolean = false;
  constructor(private authService: AuthserviceService, private router: Router){}
  show_sideNav: boolean = true;

  ngOnInit(): void {
    this.authService.autoLoggedIn();

    this.authService.userSubject.subscribe((user)=>{
      this.isLoggedIn = user ? true : false;
    })

  }

  logOut(): void {
    this.isLoggedIn = false;
    this.authService.logOut();
  }

}

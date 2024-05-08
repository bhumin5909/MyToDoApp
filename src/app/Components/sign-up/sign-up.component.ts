import { ErrorMsg } from './../../Enums/error-msg';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpResponse } from 'src/app/Models/sign-up-response';
import { AuthserviceService } from 'src/app/Services/authservice.service';
import * as bootstrap  from 'bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  myForm!: FormGroup;
  isLoading:boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  authserv: AuthserviceService = inject(AuthserviceService);
  @ViewChild('myToast') bsToast!: ElementRef;
  myToastElement!:HTMLElement;
  bsToaster!: bootstrap.Toast;
  positiveResponse!: string;
  negativeResponse!: string;

  constructor(private router: Router){}

  ngOnInit() {
    this.myForm = this.fb.group({
      fname:['', Validators.required],
      lname:['',Validators.required],
      uemail: ['', [Validators.required,Validators.email]],
      pswd: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.myToastElement = this.bsToast.nativeElement;
    this.bsToaster = new bootstrap.Toast(this.myToastElement);
  }

  submitSignUp(){
    this.isLoading = true;
    this.authserv.signUp(this.myForm.value.uemail,this.myForm.value.pswd).subscribe({next:(response:SignUpResponse)=>{
      this.isLoading = false;
      this.positiveResponse = "Succesfully signed up";
      this.router.navigate(['/Dashboard']);
    },
    error:(err:string)=>{
      this.isLoading = false;
      this.negativeResponse = err;
      this.bsToaster.show();
      setTimeout(()=>{this.closeToast()},10000);
    }
  });
  }

  closeToast():void {
    this.bsToaster.hide();
  }
}

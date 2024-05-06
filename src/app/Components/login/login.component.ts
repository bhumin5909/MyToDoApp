import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthserviceService } from 'src/app/Services/authservice.service';
import * as bootstrap from 'bootstrap';
import { SignUpResponse } from 'src/app/Models/sign-up-response';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  myForm!: FormGroup;

  isLoading:boolean = false;

  fb: FormBuilder = inject(FormBuilder);
  authserv: AuthserviceService = inject(AuthserviceService);
  autohidden:boolean = false;

  @ViewChild('myToast') bsToast!: ElementRef;
  myToastElement!:HTMLElement;
  bsToaster!: bootstrap.Toast;

  positiveResponse: string | undefined;
  negativeResponse: string | undefined;

  // router: Router = new Router();
  constructor(private router: Router){}

  ngOnInit() {
    this.myForm = this.fb.group({
      uemail: ['', [Validators.required,Validators.email]],
      pswd: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    this.myToastElement = this.bsToast.nativeElement;
    this.bsToaster = new bootstrap.Toast(this.myToastElement);
  }

  submitLogin()
  {
    this.isLoading = true;
    this.authserv.login(this.myForm.value.uemail, this.myForm.value.pswd).subscribe({
      next: (response: SignUpResponse) => {
        this.isLoading = false;
        this.positiveResponse = "Logged In Successfully";
        this.router.navigate(['/Dashboard']);
      },
      error: (err:string) => {
        this.isLoading = false;
        this.negativeResponse = err;
        this.bsToaster.show();
        setTimeout(()=>{this.closeToast()}, 10000);
      }
    })
  }


  closeToast():void {
    this.bsToaster.hide();
    this.positiveResponse= undefined;
    this.negativeResponse= undefined;

  }
}

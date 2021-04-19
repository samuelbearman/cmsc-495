import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    let creds = this.validateForm.value;

    this.authenticationService.login(creds).subscribe(data => {
      console.log(data)
      this.router.navigateByUrl('/home');
    });
  }

  quickLogin(): void {
    let creds = this.validateForm.value;

    this.authenticationService.login(creds).subscribe(data => {
      console.log(data)
      this.router.navigateByUrl('/home');
    });
  }

  ngOnInit(): void {
    if(this.authenticationService.currentUserValue != null) {
      this.router.navigateByUrl('/home');
    }
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      name:[null, [Validators.required]],
      remember: [true],
    });
  }

}

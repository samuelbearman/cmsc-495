import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoreModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }

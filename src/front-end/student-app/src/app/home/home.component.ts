import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  name: string

  ngOnInit(): void {
    this.name = this.authenticationService.currentUserValue.email
  }

}

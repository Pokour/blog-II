import { Component, OnInit } from '@angular/core';
import { AuthsService } from 'src/app/service/auths.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input()  isSticky: Boolean; //Getting from app.components

  constructor( public auth: AuthsService ) { }

  ngOnInit() {
    console.log(this.isSticky)
  }

  accountlogout(){
    this.auth.logout();
  }

}

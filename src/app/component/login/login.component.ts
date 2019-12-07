import { Component, OnInit } from '@angular/core';
import { AuthsService } from 'src/app/service/auths.service';
import { ActivatedRoute } from '@angular/router';
import { AppUtilService } from 'src/app/service/app-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private  auth: AuthsService, private route: ActivatedRoute, private _apputil: AppUtilService) {
  }

  ngOnInit() {
    const storedUrl = localStorage.getItem('storedUrl');
    if(storedUrl){
      this._apputil.loadingStarted();
    }
  }

  googlesignup(){
    this.auth.login();
  }

}

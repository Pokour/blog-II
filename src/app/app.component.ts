import { Component } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { UserService } from './service/user.service';
import { AuthsService } from './service/auths.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AppUtilService } from './service/app-util.service';
import { startWith, delay, tap, catchError } from 'rxjs/operators';
export let browserRefreshforApp = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'blog-II';
  spinnerVisible: boolean;
  subscription: Subscription;
  isSticky: boolean = false;


  constructor(userService: UserService, 
    private auth: AuthsService, 
    private router: Router, 
    private utility: AppUtilService, 
    private _apputil: AppUtilService) {
    
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefreshforApp = !router.navigated;
      }
    });
    
    auth.user$.subscribe(user => {
      if (user) {
        this._apputil.loadingEnded();
        console.log('User Object recieved after Authentication in appcomponent',user);
        // if user is logged in we update the email and name in the firebase database using save() defined in UserService.
        userService.save(user);
        const storedUrl = localStorage.getItem('storedUrl');
        if( this.router.url == '/login' || this.router.url.indexOf('/login') > -1){
          this.auth.postLoggedIn();
        }
    localStorage.clear();
      }
    });
  }

  ngAfterViewInit() {
    this.utility.getSpinnerSubject()
      .pipe(
        startWith(null),
        delay(0),
        tap(data => this.spinnerVisible = data),
        catchError(data => throwError(data))
      ).subscribe();
  }

  ngOnInit() {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
  
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
          this.router.navigated = false;
          window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy(){
    localStorage.clear();
    this.subscription.unsubscribe();
  }
  
  
}

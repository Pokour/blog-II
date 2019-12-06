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
    private utility: AppUtilService, // why AppUtilService is having 2 Instances ?
    private _apputil: AppUtilService) {

    /**********************************************************************
     * EXPLAIN THE CODE BELOW
     * ********************************************************************/
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefreshforApp = !router.navigated;
      }
    });

    /**********************************************************************
     * 1. Authentication starts from app.component.ts
     * 2. Subscribe to the USER Observable in Authentication service.
     * 3. Pass the recieved user object to save method in userService, user
     *    parameters "name" and "email" are updated.
     * 4. EXPLAIN the routing code after user is saved.
     **********************************************************************/
    auth.firebaseUserObservable$.subscribe(userObjectRecieved => {
      if (userObjectRecieved) {
        // this._apputil.loadingEnded();
        console.log('User Object recieved after Authentication in appcomponent', userObjectRecieved);
        userService.save(userObjectRecieved);
        const storedUrl = localStorage.getItem('storedUrl');
        if (this.router.url == '/login' || this.router.url.indexOf('/login') > -1) {
          this.auth.postLoggedIn();
        }
        localStorage.clear();
      }
    });
  }

  // ngAfterViewInit() {
  //   this.utility.getSpinnerSubject()
  //     .pipe(
  //       startWith(null),
  //       delay(0),
  //       tap(data => this.spinnerVisible = data),
  //       catchError(data => throwError(data))
  //     ).subscribe();
  // }

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

  ngOnDestroy() {
    localStorage.clear();
    this.subscription.unsubscribe();
  }


}

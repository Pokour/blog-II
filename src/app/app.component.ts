import { Component } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { UserService } from './service/user.service';
import { AuthsService } from './service/auths.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AppUtilService } from './service/app-util.service';
import { startWith, delay, tap, catchError } from 'rxjs/operators';

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
    auth: AuthsService, private router: Router, private _apputil: AppUtilService) {

    /**********************************************************************
     * 1. Authentication starts from app.component.ts
     * 2. Subscribe to the USER Observable in Authentication service.
     * 3. Create a new function in UserService mandatoryLoginRoutine().
     *    userObjectRecieved is passed as a parameter.
     * 4. Retrieve the stored url in local storage to navigate to the same route
     *    that the user was trying to reach before signing with redirect.
     * 5. EXPLAIN the routing code after navigateByUrl is saved.------------------## TODO ##
     */
    auth.firebaseUserObservable$.subscribe(userObjectRecieved => {
      if (userObjectRecieved) {
        this._apputil.loadingEnded();
        console.log('USEROBJECT recieved from FireAuthModule', userObjectRecieved);
        userService.mandatoryLoginRoutine(userObjectRecieved);
        let storedUrl = localStorage.getItem('storedUrl');
        if (storedUrl !== null) {
          router.navigateByUrl(storedUrl);
        }
        console.log('storedURL', storedUrl)
        localStorage.clear();
      }
    });
  }

  ngAfterViewInit() {
    /*****************************************************************
     * This is the code for loader. Spinner Subject gets the boolean
     * value as per which it gets displayed and not displayed.
     * If spinnerVisible is true, loader is shown otherwise not.
     */
    this._apputil.getSpinnerSubject()
      .pipe(
        startWith(null),
        delay(0),
        tap(data => this.spinnerVisible = data),
        catchError(data => throwError(data))
      ).subscribe();
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnDestroy() {
    localStorage.clear();
    this.subscription.unsubscribe();
  }


}

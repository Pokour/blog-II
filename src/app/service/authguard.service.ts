import { Injectable } from '@angular/core';
import { AuthsService } from './auths.service';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/****************************************************************************
 * authguard service contains the logic to keep the user access routes
 * that are authorised.
 * If the user is authenticatedcanActivate property is used to return a TRUE
 * to the app-routing.module.ts
 * If user is not authenticated router.navigate() is used to redirect the user
 * to the login page and queryParams property of the navigate() method is
 * used to store the URL that the user tried to access in key "queryUrl" by 
 * using "state.url" property of queryParams.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private auth: AuthsService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    return this.auth.firebaseUserObservable$.pipe(map(user => {
      if (user) {
        console.log("AuthGuard checked USER")
        return true;
      }
      if (!user) {
        state.url = "/blog-II"+ state.url // added this for subdomain routing
        console.log("Connot find USER. The attempted route is " + state.url);
        this.router.navigate(['/login'], { queryParams: { queryUrl: state.url } });
      }
    }));

  }
}

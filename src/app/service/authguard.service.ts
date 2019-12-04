import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private auth: AuthsService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean | Promise<boolean> {
    return this.auth.user$.pipe(map(user => {
      if (user) {
        console.log("AuthGuard checked USER")
        return true;
      }
      else {
        console.log("Connot find USER. Navigating to Login page! Stored present url in queryParams using state property");
        console.log("the saved URL is  " + state.url);
        this.router.navigate(['/login'], { queryParams: { queryUrl: state.url } });
      }

    }));

  }

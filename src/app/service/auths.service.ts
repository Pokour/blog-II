import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtilService } from './app-util.service';
import * as firebase from 'firebase';

/***********************************************************************
 * AuthService is a central place that allows us to login, signup
 * or logout users, so we’ll define methods for these 3 actions.
 * All the authentication logic will be in the service,
 * which will allow us to create components that don’t need to implement
 * any auth logic and will help keep our components simple.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthsService {
  /***********************************************************************
   * Create observable firebaseUserObservable$ it saves the user object from 
   * AngularFireAuth only if user object is already present in
   * AngularFireAuth module.
   * If firebaseUserObservable$ is null then app is in logged out state.
   */
  firebaseUserObservable$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth, private route: ActivatedRoute,
    private router: Router, private _apputil: AppUtilService) {
    this.firebaseUserObservable$ = afAuth.authState;  // user observable
  }
  /***********************************************************************
   * 1. Login process starts with storing the current url parameter to which
   *    the page has to return back after signing in by google redirect.
   * 2. AngularFireAuth module is used to signinwithredirect and use
   *    new firebase.auth.GoogleAuthProvider for authentication
   */
  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('queryUrl') || '/';
    localStorage.setItem('storedUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    // this._apputil.loadingStarted();
  }
  /***********************************
   * What is this for ?
   */
  // postLoggedIn() {
  //   this.router.navigateByUrl('/');
  // }
  /********************************************
   * AngularFireAuth module id used to sign out
   */
  logout() {
    this.afAuth.auth.signOut();
  }
}

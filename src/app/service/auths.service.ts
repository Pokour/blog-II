import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUtilService } from './app-util.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthsService {

  user$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private _apputil: AppUtilService) {
    this.user$ = afAuth.authState;
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('queryUrl') || '/';
    localStorage.setItem('storedUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    this._apputil.loadingStarted();
  }

  postLoggedIn() {
    this.router.navigateByUrl('/');
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

import { Injectable } from '@angular/core';

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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dataShare: BehaviorSubject<any> = new BehaviorSubject({} as any);
  data$ = this.dataShare.asObservable();

  constructor() { }

  sendToSubject(data) {
    this.dataShare.next(data);
    console.log('Data to  SUBJECT', data);
  }

  // This method is called as the user loggs in and updates name and email in firebase.
  save(user: firebase.User) {
    firebase.database().ref('/user/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });
  }

  readUser(uid) {
    return firebase.database().ref('/user/' + uid).once('value').then(function (snapshot) {
      const userdata = snapshot.val();
      return userdata;
    });
  }

  updateUser(uid, seletedRole, requestStatus, userRow, roleRow, state) {
    firebase.database().ref('/user/' + uid).update({
      role: seletedRole,
      requestStatus: requestStatus,
      metadata: { roleSheet: roleRow, user: userRow }
    });
  }
}

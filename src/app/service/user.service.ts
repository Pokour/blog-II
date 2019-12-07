import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

/********************************************************************
 * UserService deals with all the data interaction with Firebase Mainly
 * saving updating and reading user to realtime database.UserService
 * hosts a BehaviourSubject which is used to bridge user data between
 * different components. .next() function is used to push data to
 * the subject.
 * To retrieve the data from the subject a data$ observable is created 
 * that needs to be subscribed to get the data in any component
 */

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /************************************************************
   * dataShare is the the Behaviour subject
   * data$ is the obserable defined for the Behaviour subject
   */
  private dataShare: BehaviorSubject<any> = new BehaviorSubject({} as any);
  data$ = this.dataShare.asObservable();

  constructor() {
  }
  /**********************************************************
   * This function send tha data to the subject by .next()
   * function
   */
  sendToSubject(data) {
    this.dataShare.next(data);
    console.log('Data to  SUBJECT', data);
  }
  /**********************************************************
   * This function is used to save name and email of the user
   * to Firebase database
   */
  save(user: firebase.User) {
    firebase.database().ref('/user/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });
  }
  /**********************************************************
   * This function is used to read the entire user footprint
   * of user in Firebase database under UID.
   * It reads only once the function is triggered.
   */
  readUser(uid) {
    return firebase.database().ref('/user/' + uid).once('value').then(function (snapshot) {
      const userdata = snapshot.val();
      return userdata;
    });
  }
  /**********************************************************
   * updateUser is used to define the metadta and basic database
   * structure to the new signed in user who submits the profile
   */
  updateUser(uid, seletedRole, requestStatus, userRow, roleRow, state) {
    firebase.database().ref('/user/' + uid).update({
      role: seletedRole,
      requestStatus: requestStatus,
      metadata: { roleSheet: roleRow, user: userRow }
    });
  }
}

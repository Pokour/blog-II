import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
import { AppUtilService } from './app-util.service';

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
  subjectDataObservable$ = this.dataShare.asObservable();
  userType: string;
  userAuthObject: firebase.User;
  fireDBObj: any;
  constructor(private _apputil: AppUtilService) {
  }
  /**************************************************************
   * Objective of mandatoryLoginRoutine() method is to kick in right
   * after a user logs in and determine current status of the user 
   * and other details about user that would be pushed in to the
   * behaviour subject and utilized in other components.
   * 1. Read the data footprint in Firebase DB.
   * 2. Check the recieved data to determine initial status of user.
   *    Is the user (First time logged in) / (logged in earlier).
   * 3. Determine the current status and update in the Behavioursubject.
   * 4. Update the Firebase DB with basic updates for new user and 
   *    Timestamp details for existing user. 
   */
  mandatoryLoginRoutine(userObjRecieved) {
    this.userAuthObject = userObjRecieved;
    this.getDataFootprint(userObjRecieved).then(fData => {
      this._apputil.loadingEnded();
      this.checkUserStatus(fData);
      console.log("FIREBASE data recieved in userservice", fData);
    });
  }

  /********************************************************************
   * STEP 1
   * Get the data footprint from the Firebase DB to analyse the USER
   * getDataFootprint() accepts userObjectRecieved recieved from
   * fireAuthModule.
   * promise is returned by the method with data from the UID.
   */
  getDataFootprint(userObjectRecieved) {
    return firebase.database().ref('/user/' + userObjectRecieved.uid).once('value').then(function (snapshot) {
      const userData = snapshot.val();
      return userData;
    });
  }

  /********************************************************************
   * STEP 2
   * Determine the USER status
   * a. "FIRST TIME"
   * b. "OLD WITHOUT PROFILE"
   * c. "OLD WITH PROFILE" 
   * d. Update to BehaviourSubject
   */
  checkUserStatus(fData) {
    this.fireDBObj = fData;
    if (fData) {
      if (fData.metadata) {
        this.userType = "OUWP";  // OLD USER WITH PROFILE
        this.saveToFirebaseOnLogin(this.userAuthObject, {
          lastTimestamp: new Date()
        });
      }
      if (!fData.metadata) {
        this.userType = "EUWOP"; // EXISTING USER WITHOUT PROFILE
        this.saveToFirebaseOnLogin(this.userAuthObject, {
          lastTimestamp: new Date()
        });
      }
    }
    if (fData == null) {
      this.userType = "NU";      // NEW USER
      this.saveToFirebaseOnLogin(this.userAuthObject, {
        name: this.userAuthObject.displayName,
        email: this.userAuthObject.email,
        lastTimestamp: new Date(),
        signupTimestamp: new Date()
      });
    }
    this.sendToSubject({userType: this.userType, fireAuthObj: this.userAuthObject, fData: this.fireDBObj});
  }
  
  /************************************************************************
   * STEP 3
   * Update the data to the Firebase DB
   * saveToFirebaseOnLogin(p1,p2) recieves two parameters
   * p1 is (user: firebase.User) the user object recieved from fireAuthModule
   * p2 is the (obj: Object) object that needs to be updated in the FDB.
   * this function updates the object passed as parameter to the node in
   * FDB inside UID
   */
  saveToFirebaseOnLogin(user: firebase.User, obj: Object) {
    firebase.database().ref('/user/' + user.uid).update(obj);
  }
  /**********************************************************
   * This function send tha data to the subject by .next()
   * function
   */
  sendToSubject(data) {
    this.dataShare.next(data);
    console.log('DATA LOADED TO BEHAVIOUR SUBJECT', data);
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
   * writeNewSignedInUser is used to define the metadta and basic database
   * structure to the new signed in user who submits the profile
   */
  writeNewSignedInUser(uid, seletedRole, userRow, roleRow, state) {
    console.log(state);
    let requestStatus = "";
    if (seletedRole == "student") {
      requestStatus = "granted";
    } else {
      requestStatus = "requested";
    }
    firebase.database().ref('/user/' + uid).update({
      role: seletedRole,
      requestStatus: requestStatus,
      metadata: { roleSheet: roleRow, user: userRow }
    });
  }
}

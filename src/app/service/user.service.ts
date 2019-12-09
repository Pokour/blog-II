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
  subjectDataObservable$ = this.dataShare.asObservable();
  userType;
  uid;
  userObjectRecieved;
  constructor() {}

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

  mandatoryLoginRoutine(userObjectRecieved) {
    this.userObjectRecieved = userObjectRecieved;
    this.getDataFootprint(userObjectRecieved).then(dataFootprint => {
      this.checkUserStatus(dataFootprint);
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
      const userdata = snapshot.val();
      return userdata;
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

  checkUserStatus(dataFootprint) {
    if (dataFootprint) {
      if (dataFootprint.metadata) {
        this.userType = "OUWP";  // OLD USER WITH PROFILE
        this.saveToFirebaseOnLogin(this.userObjectRecieved, {
          lastTimestamp: new Date()
        });
      }
      if (!dataFootprint.metadata) {
        this.userType = "EUWOP"; // EXISTING USER WITHOUT PROFILE
        this.saveToFirebaseOnLogin(this.userObjectRecieved, {
          lastTimestamp: new Date()
        });
      }
    }
    if (dataFootprint == null) {
      this.userType = "NU";      // NEW USER
      this.saveToFirebaseOnLogin(this.userObjectRecieved, {
        name: this.userObjectRecieved.displayName,
        email: this.userObjectRecieved.email,
        lastTimestamp: new Date(),
        signupTimestamp: new Date()
      });
    }
    const { displayName, email, photoURL, uid } = this.userObjectRecieved;
    var dataObject = { uData:{name: displayName, email: email, photoURL: photoURL,
      uid: uid, userType: this.userType},
      fData: dataFootprint
    }
    this.sendToSubject(dataObject);
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
    console.log('Data to  SUBJECT', data);
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

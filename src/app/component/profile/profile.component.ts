import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { AuthsService } from 'src/app/service/auths.service';
import { UserService } from 'src/app/service/user.service';
import { AppUtilService } from 'src/app/service/app-util.service';

/********************************************************************
 * Objective of this component is to etrieve data from the Firebase
 * and google sheet. This data is consumed by the user profile and forms
 * Behaviour subject has firebaseUserObject and Firebase DB data from
 * mandatoryLoginRoutine login routine. 
 * 1. Subscribe to the behaviourSubject to get firebase datafootprint,
 *    firebaseUserObject and inferred userType.
 * 2. Destructure data accoring to the userType
 * 3. generate a querystring to send request to Google Sheet data
 * 4. read data from Google sheets.
 * 4. Structure the object with GS data FB and upadte it in subject.
 */

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  uid = '';
  newLibraryString = 'none';
  subData: any = {};
  googledata: Object;
  // queryParamsObject: {};
  role;
  recievedSubjectData: any = {};
  query = "";

  constructor(
    private crud: CrudService, public auth: AuthsService, private userService: UserService,
    private _apputil: AppUtilService) {
    userService.subjectDataObservable$.subscribe(recievedSubjectData => {
      this.recievedSubjectData = recievedSubjectData;
    });
  }
  /*******************************************************************
   * 1. Destructuring of the behaviourSubject and get dataFootprint
   *    and other data.
   * 2. generate querystring for the request to be send to Google Sheets
   * 3. 
   */
  ngOnInit() {
    // this._apputil.loadingStarted();
    // this.userService.readUser(this.uid).then(data => {
    //   if (data) {
    //     console.log('Data from FIERBASE', data);
    //     this.unwrapData(data);
    //   }
    // });
    const { uData: { name, email, photoURL, uid, userType }, dataFootprint, uData } = this.recievedSubjectData;
    this.subData = {fData:dataFootprint, uData: uData};
    this.dataUnwrap(name, email, photoURL, uid, userType, dataFootprint);
  }
  /************************************************************************
   * 1. Destructuring dataFootprint recieved from Behaviour subject.
   * 2. Check userType "OUWP" "EUWOP" "NU"
   * 3. generate query string to request Google Sheet
   * 4. Send Google Sheet data to behaviur subject
   */
  dataUnwrap(name, email, photoURL, uid, userType, dataFootprint) {
    const { lastTimestamp, requestStatus, role, signupTimestamp, metadata: { roleSheet, user, library } } = dataFootprint;
    this.subData.fData = dataFootprint
    if (userType == "OUWP") {
      this.query = this.generateQueryString(role, requestStatus, user, roleSheet)
        + "&library=" + this.generateLibraryString(library);
      this.getGoogleSheetData(this.query);
    }
    if (userType == "EUWOP") {
      this.query = this.generateQueryString(role, requestStatus, user, roleSheet);
      this.getGoogleSheetData(this.query);
    }
    if (userType == "NU") {

    }
  }
  /*************************************************************************
   * Generating query string. Basic essential parameters
   * role, requestStatus, user, roleSheet
   */
  generateQueryString(role, requestStatus, user, roleSheet) {
    var queryString = "?action=read&role=" + role + "&requestStatus=" + requestStatus + "&userPointer="
      + user + "&rolePointer=" + roleSheet;
    return queryString;
  }
  /************************************************************************
   * This function checks for existance of library node in Firebase DB
   * If library array is detected it is converted to a string separated by ","
   * If no library is detected "none" is returned
   */
  generateLibraryString(library) {
    if (library) {
      var libToString = '';
      for (let i = 0; i < (library.length); i++) {
        libToString = libToString + library[i] + ",";
      }
      return libToString;
    }
    return "none"
  }
  /*************************************************************************
   * This function takes the query string and requests the Google Sheet data
   * from CRUD service.
   * As the data is recieved the data is passed to the Payload function as
   * parameter
   */
  getGoogleSheetData(qstring) {
    this.crud.readGsData(qstring).subscribe(data => {
      if (data) {
        this.payLoadtoSubject(data);
      }
    });
  }

  payLoadtoSubject(gData) {
    this.subData.gData = gData;
    this.userService.sendToSubject(this.subData);
  }

}

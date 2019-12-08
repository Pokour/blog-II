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
  queryParamsObject: {};
  role;

  constructor(
    private crud: CrudService,
    public auth: AuthsService,
    private userService: UserService,
    private _apputil: AppUtilService
  ) { 
    userService.subjectDataObservable$.subscribe(data => {
      this.uid = data.uid;
    });
  }

  ngOnInit() {
    this._apputil.loadingStarted();
    this.userService.readUser(this.uid).then(data => {
      if (data) {
        console.log('Data from FIERBASE', data);
        this.unwrapData(data);
      }
    });
  }

   // This unwarapps the data recieved from the firebase
   unwrapData(data) {
    // Firebase data appended to subject object
    this.subData.fData = data;
    this.subData.fData.uid = this.uid;
    this.role = this.subData.fData.role;
    let queryString = ''; // Query parameters to pass to the appscript
    //logic to check the status and nature of the user loggedIn and fetch data from GS
    if (this.subData.fData.metadata) { // If the user is old
      console.log('OLD USER');
      // Data destructured
      const { role, requestStatus, metadata: { user, roleSheet } } = data;
      // converting all library pointers to a string      
      if (data.metadata.library) {
        this.newLibraryString = '';
        for (let i = 0; i < (data.metadata.library.length); i++) {
          this.newLibraryString = this.newLibraryString + data.metadata.library[i] + ",";
        }
      }
      console.log('Library STRING', this.newLibraryString);       // library elements converted to string
      queryString = "?action=read&role=" + role + "&requestStatus=" + requestStatus + "&userPointer="
        + user + "&rolePointer=" + roleSheet + "&library=" + this.newLibraryString;
      console.log('Query STRING', queryString);

      // read the data from google sheet subscribe and store in gData
      this.crud.readGsData(queryString).subscribe((data: any) => {
        if (data) {
          this.subData.gData = data;
          console.log('Data Recieved GOOGLESHEETS', data);
          this._apputil.loadingEnded();
        }
      });
    }

    
    else if (this.subData.metadata == undefined) { // if the user is new
      console.log('New User');
      this._apputil.loadingEnded();
    }

    // Loading the data to the subject
    this.userService.sendToSubject(this.subData);
  }


}

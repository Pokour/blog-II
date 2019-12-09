import { Component, OnInit } from '@angular/core';
import { AuthsService } from 'src/app/service/auths.service';
import { CrudService } from 'src/app/service/crud.service';
import { UserService } from 'src/app/service/user.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
/***********************************************************************
 * This component handles data that to be send to Google Sheet and also
 * the data recieved from Google Sheet.
 * 1. There are predefined data objects to send and recieve data like
 *    student{} collaborator{} organisation{} and an array roleOptions[]
 */

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  roleOptions = ['None', 'student', 'collaborator', 'organisation'];
  rSubData;
  requestStatus;
  seletedRole;
  uid = '';
  states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry"
  ]
  student = {
    add1: '',
    add2: '',
    add3: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
    altmobile: '',
    instituteselected: '',
    institutelisted: '',
    institute: '',
    standard: '',
    interest1: '',
    interest2: '',
    interest3: '',
    dob: ''
  };
  collaborator = {
    add1: '',
    add2: '',
    add3: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
    altmobile: '',
    instituteselected: '',
    institutelisted: 'true',
    institute: '',
    collegeselected: '',
    collegelisted: '',
    college: '',
    Degree: '',
    startdate: '',
    enddate: '',
    interest1: '',
    interest2: '',
    interest3: '',
    dob: ''
  };
  organisation = {
    address1: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    pincode: '',
    office: '',
    officeemail: '',
    officephone: '',
    principal: '',
    principalemail: '',
    principalphone: '',
    poc: '',
    pocemail: '',
    pocphone: '',
  };
  /*******************************************************************************
   * Behaviour subject is subscribed to get data
   * Recieved data is saved to global object "rSubData" for easy access throuhout
   * the component.
   */
  constructor(
    public auth: AuthsService, private http: HttpClient, private crud: CrudService,
    public userService: UserService,
    private ns: ToastrService) {
    this.userService.subjectDataObservable$.subscribe((data: any) => {
      console.log('Data recieved in forms from subject', data);
      this.rSubData = data;
      this.uid = data.fireAuthObj.uid;
    });
  }
  /***********************************************************************
   * Data flow is determined by the type of user logged in. Check UserType
   * 1. Destructure rSubData to get userType
   * 2. function call to update data objects according to role.
   */
  ngOnInit() {
    const { userType } = this.rSubData
    if (userType == "NU") {

    }
    if (userType == "EUWOP") {

    }
    if (userType == "OUWP") {
      this.updateRoleObj();
    }
  }
  /**********************************************************************
   * The user data recieved from Google Sheet is updated to role object
   * 1. role from fData is passed to a global variable selectedRole
   * 2. based on selectedRole data is passed to the particular object
   */
  updateRoleObj() {
    this.seletedRole = this.rSubData.fData.role;
    console.log("ROLE updated from Gdata",this.seletedRole)
    if (this.seletedRole == 'student') {
      this.student = this.rSubData.gData.role;
    } else if (this.seletedRole == 'collaborator') {
      this.collaborator = this.rSubData.gData.role;
    } else if (this.seletedRole == 'organisation') {
      this.organisation = this.rSubData.gData.role;
    }
  }
  /********************************************************************
   * This binds the selected role by the user and updates the global
   * varible "seletedRole"
   */
  selectedRoleByUser(role) {
    this.seletedRole = role;
    console.log(role)
  }
  /************************************************************************
   * This function kicks in after user hits the submit button. It validates
   * userType to take appropriate actions.
   * 1. Destructure rSubData (global variable to get subscribed subject data)
   *    to get userType
   * 2. If(userType) and trigger creation of profile or update of profile
   */
  submit_student_info() {
    const { userType } = this.rSubData;
    if (userType == "NU") {
      this.createUserProfile('write');
    }
    if (userType == "EUWOP") {
      this.createUserProfile('write');
    }
    if (userType == "OUWP") {
      this.updateOldUserProfile('update');
    }
  }
  /*************************************************************************
   * ALL CRUD functions dealing with Google Sheets is in crudService.
   * createUserProfile(action) takes a parameted to define the action that
   * is to be performed on GoogleSheet.
   * 1. genQString(action) is triggered to get the qString.
   * 2. writeGsData(qString) from crudService to write to Google Sheet
   * 3. confirmation data is returned from Google Sheet App Script with roleRow
   *    and userRow.
   * 4. confirmationBackToFdb(data) is used to handle returned data
   */
  createUserProfile(action) {
    var qString = this.genQString(action);
    this.crud.writeGsData(qString).subscribe(confirmation => {
      console.log('RETURN after UPDATE', confirmation);
      var data: any = confirmation;
      if (data) {
        this.confirmationBackToFdb(data);
        this.ns.success('Form Submitted Successfully');
      }
    });
  }
  /***********************************************************************
   * Data recieved after query is sent to Google Sheet is destructured to
   * get userRow, roleRow, state and passed as parameter into
   * writeNewSignedInUser(userRow, roleRow, state) to 
   * set metadata in Firebase DB
   */
  confirmationBackToFdb(data) {
    const { userRow, roleRow, state } = data
    this.userService.writeNewSignedInUser(this.uid, this.seletedRole, userRow, roleRow, state);
  }

  updateOldUserProfile(action) {
    const { gData, fData: { metadata: { roleSheet, user } } } = this.rSubData;
    // var action = 'update';
    var qString = this.genQString(action);
    qString = qString + '&userPointer=' + user + '&rolePointer=' + roleSheet;
    console.log('user is old', qString);
    this.crud.updateGsData(qString).subscribe(confirmation => {
      if (confirmation){
        this.ns.success('Form Submitted Successfully');
        console.log('RETURN after UPDATE', confirmation)
      }
    });
  }

  genQString(action) {
    var qString;
    if (this.seletedRole == 'student') {
      qString = this.objectToQueryString(this.student, action);
    } else if (this.seletedRole == 'collaborator') {
      qString = this.objectToQueryString(this.collaborator, action);
    } else if (this.seletedRole == 'organisation') {
      qString = this.objectToQueryString(this.organisation, action);
    }
    console.log(qString);
    return qString;
  }

  objectToQueryString(object, action) {
    let keys = Object.keys(object);
    let values = Object.values(object);
    let abc = '?action=' + action + '&';
    for (var i = 0; i < keys.length; i++) {
      abc = abc + keys[i] + '=' + values[i] + '&';
    }
    abc = abc + 'role=' + this.seletedRole + '&uid=' + this.uid;
    return abc;
  }

}

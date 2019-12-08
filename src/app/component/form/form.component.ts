import { Component, OnInit } from '@angular/core';
import { AuthsService } from 'src/app/service/auths.service';
import { CrudService } from 'src/app/service/crud.service';
import { UserService } from 'src/app/service/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  roleOptions = ['None', 'student', 'collaborator', 'organisation'];
  subData: any = {};
  seletedRole;
  uid;
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

  constructor(
    public auth: AuthsService,
    private http: HttpClient,
    private crud: CrudService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userService.subjectDataObservable$.subscribe((data: any) => {
      console.log('Data recieved in forms from subject', data);
      this.subData = data;
      this.seletedRole = this.subData.fData.role;     // append role infoe fron GS to selectedRole
      this.uid = data.uData.uid;
      if (this.seletedRole == 'student') {            // Check for selected role or Stored
        this.student = this.subData.gData.role;
      } else if (this.seletedRole == 'collaborator') {
        this.collaborator = this.subData.gData.role;
      } else if (this.seletedRole == 'organisation') {
        this.organisation = this.subData.gData.role;
      }
    });
  }

  selectedRoleByUser(role) {
    this.seletedRole = role;
    console.log(role)
  }

  submit_student_info() {
    const { uData: { uid, userType, } } = this.subData;
    if (userType == "NU") {
      // metadadat should be saved after submit
      this.createUserProfile();
    }
    if (userType == "EUWOP") {
      // metadadat should be saved after submit
      this.createUserProfile();
    }
    if (userType == "OUWP") {
      // Old user data must be updated and callback shold be updated to FDB
    }

  }

  createUserProfile() {
    var action = 'write';
    var qString = this.genQString(action);
    var requestStatus;
    if (this.seletedRole == "student") {
      requestStatus = "granted";
    } else {
      requestStatus = "requested";
    }
    this.crud.writeGsData(qString).subscribe(confirmation => {
      console.log('RETURN after UPDATE', confirmation);
      var data: any = confirmation;
      if (data) {
        const { userRow, roleRow, state } = data;
        this.confirmationBackToFdb(this.uid, this.seletedRole, requestStatus, userRow, roleRow, state);
      }
    });
  }

  confirmationBackToFdb(uid, seletedRole, requestStatus, userRow, roleRow, state) {
    this.userService.updateUser(uid, seletedRole, requestStatus, userRow, roleRow, state);
  }

  updateOldUserProfile() {
    const { gData, fData: { metadata: { roleSheet, user } } } = this.subData;
    var action = 'update';      // Update procedure for existing user
    var qString = this.genQString(action);
    qString = qString + '&userPointer=' + user + '&rolePointer=' + roleSheet;
    console.log('user is old', qString);
    this.crud.updateGsData(qString).subscribe(confirmation => {
      console.log('RETURN after UPDATE', confirmation)
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

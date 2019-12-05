import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppUtilService {
  busyCount: any = 0;
  spinnerVisible: any = false;
  private spinnerSubject = new Subject<any>();

  constructor() { }

  loadingStarted() {
    this.busyCount++;
    if (!this.spinnerVisible) {
      this.spinnerVisible = true;
      this.spinnerSubject.next(this.spinnerVisible);
    }
  }

  loadingEnded() {
    this.busyCount--;
    this.busyCount = (this.busyCount < 0) ? 0 : this.busyCount;
    if (this.busyCount === 0) {
      this.spinnerVisible = false;
      this.spinnerSubject.next(this.spinnerVisible);
    }
  }

  getSpinnerSubject() {
    return this.spinnerSubject;
  }
}

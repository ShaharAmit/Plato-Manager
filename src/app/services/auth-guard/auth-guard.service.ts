import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import { FirebaseService } from '../firebaseService/firebase.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private fb: FirebaseService, private router: Router) {

  }

  canActivate() {
    if (this.fb.uid != null) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

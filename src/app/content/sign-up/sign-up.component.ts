import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  model = {
    name: '',
    email: '',
    pass: ''
  };
  constructor(private fb: FirebaseService, private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    const ref = this.fb.auth;
    const email = this.model.email;
    const pass = this.model.pass;
    const name = this.model.name;
    ref.createUserWithEmailAndPassword(email, pass)
      .then(() => {
        this.fb.firebaseLogin(email, pass);
        const currentUser = this.fb.auth.currentUser;
        return currentUser.sendEmailVerification()
          .then(() => {
            currentUser.updateProfile({
            displayName: name,
            photoURL: ''
          }).then(() => {
            this.fb.fs.doc('Users/' + currentUser.uid).update({
              name: name
            });
            this.fb.name = name;
            return this.router.navigate(['/login']);
          });
        });
      }).catch(err => {
        console.error(err);
    });
  }
}

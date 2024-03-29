import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebaseService/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = {
    email: '',
    pass: ''
  };
  header: HTMLHeadElement;
  formGroup: HTMLCollectionOf<HTMLDivElement>;
  logIn: HTMLButtonElement;
  logoOt: HTMLButtonElement;
  forgotPass: HTMLButtonElement;

  constructor(private fb: FirebaseService, private router: Router) {

  }

  ngOnInit() {
    this.header = document.getElementById('loginHeader') as HTMLHeadElement;
    this.formGroup = document.getElementsByClassName('form-group') as HTMLCollectionOf<HTMLDivElement>;
    this.logIn = document.getElementById('login') as HTMLButtonElement;
    this.logoOt = document.getElementById('logout') as HTMLButtonElement;
    this.forgotPass = document.getElementById('forgot') as HTMLButtonElement;
    this.changeState();
  }

  async login() {
    const email = this.model.email;
    const pass = this.model.pass;
    const check = await this.fb.firebaseLogin(email, pass);
    if (!check) {
      this.header.innerHTML = 'wrong login details';
      this.forgotPass.classList.remove('hidden');
    } else {
      console.log(this.fb.auth.currentUser.uid);
      console.log(this.fb.uid);
    }
  }

  logout() {
    this.fb.auth.signOut()
      .catch(err => {
        console.error(err);
      });
  }

  forgot() {
    const email = this.model.email;
    this.fb.auth.sendPasswordResetEmail(email).then(() => {
      this.header.innerHTML = 'email sent to: ' + email;
    }).catch(err => {
      console.error(err);
      this.header.innerHTML = 'no corresponding email ' + email;
    });
  }

  async changeState() {

    if (this.fb.name && this.fb.name !== '') {
      // this.header.innerHTML = 'Welcome ' + this.fb.name;
      // for (let i = 0; i < this.formGroup.length; i++) {
      //   this.formGroup[i].classList.add('hidden');
      // }
      // this.logIn.classList.add('hidden');
      // this.forgotPass.classList.add('hidden');
      // this.logoOt.classList.remove('hidden');
    } else {
      this.fb.auth.onAuthStateChanged(async user => {
        if (user) {
          // this.header.innerHTML = 'Welcome ';
          this.fb.name = await this.fb.fs.doc('GlobWorkers/' + user.uid).get().then(doc => {
            return doc.data().name;
          });
          this.router.navigate(['/home']);
          // this.header.innerHTML = 'Welcome ' + this.fb.name;
          // for (let i = 0; i < this.formGroup.length; i++) {
          //   this.formGroup[i].classList.add('hidden');
          // }
          // this.logIn.classList.add('hidden');
          // this.forgotPass.classList.add('hidden');
          // this.logoOt.classList.remove('hidden');
        } else {
          this.header.innerHTML = 'Welcome, please login: ';
          for (let i = 0; i < this.formGroup.length; i++) {
            this.formGroup[i].classList.remove('hidden');
          }
          this.logIn.classList.remove('hidden');
          this.forgotPass.classList.add('hidden');
          this.logoOt.classList.add('hidden');
        }
      });
    }
  }
}

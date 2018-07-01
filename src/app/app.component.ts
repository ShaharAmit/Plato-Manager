import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebaseService/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  restID: string;
  restsObj: HTMLSelectElement;
  rest: any;
  constructor(private fb: FirebaseService) {

  }

  ngOnInit() {
    this.fb.restID.subscribe(message => this.restID = message);
    this.restsObj = document.getElementById('rests') as HTMLSelectElement;
    this.restsObj.removeEventListener('change', this.changeRest());
    this.restsObj.addEventListener('change', (this.changeRest()));
  }

  unDisplayMenu (element) {
    const elem = document.getElementById(element) as HTMLButtonElement;
      elem.style.display = 'none';
  }
  changeRest(): any {
    this.rest = [];
    this.initRests();
    return null;
  }

  displayNav() {
    this.unDisplayMenu('notfi');
    const nav = document.getElementById('nav') as HTMLButtonElement;
    if (nav.style.display === 'block') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  }

  displayNotf() {
    this.unDisplayMenu('nav');
    const notf = document.getElementById('notfi') as HTMLButtonElement;
    if (notf.style.display === 'block') {
      notf.style.display = 'none';
    } else {
      notf.style.display = 'block';
    }
  }



  initRests() {
    this.fb.hasRest = false;
    this.fb.auth.onAuthStateChanged(user => {
        if (user) {
          this.fb.fs.collection('GlobWorkers/' + this.fb.uid + '/Rest')
            .get().then( docs => {
              docs.forEach(doc => {
                this.rest.push(doc.id);
                this.restsObj.value = doc.id;
                this.fb.changeRestID(this.rest[0].toString());
                this.fb.hasRest = true;
                this.loggedIn = true;
              });
            });
        }
    });
  }

}

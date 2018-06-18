import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebaseService/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  rest: Object[];
  restsObj;
  restID;
  displayNotification: Boolean = false;
  constructor(private fb: FirebaseService) {
    this.rest = [];
    this.initRests();
  }

  ngOnInit() {
    this.fb.auth.onAuthStateChanged(user => {
      const hidden = document.getElementsByClassName('holder');
      if (user) {
        for (let i = 0; i < hidden.length; i++) {
          hidden[i].classList.remove('hidden');
        }
      } else {
        for (let i = 0; i < hidden.length; i++) {
          hidden[i].classList.add('hidden');
        }
      }
    });
    const t = this;
    this.fb.restID.subscribe(message => this.restID = message);
    this.restsObj = document.getElementById('rests') as HTMLSelectElement;
    this.restsObj.addEventListener('change', () => {
      this.fb.changeRestID(this.restsObj.value);
    });
  }
  display() {
    const menu = document.getElementById('sideBar') as HTMLButtonElement;
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
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
                this.fb.changeRestID(this.rest[0].toString());
                this.fb.hasRest = true;
                this.displayNotification = true;
              });
            });
        }
    });
  }
}

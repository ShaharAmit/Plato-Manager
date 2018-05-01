import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebaseService/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  rests: Object[];
  restsObj;
  restID;
  constructor(private fb: FirebaseService) {
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
    const t = this;
    this.fb.fs.doc('Users/shahar-test')
      .onSnapshot(data => {
        t.rests = data.data().rests;
        t.fb.changeRestID(t.rests[0].toString());
      });
  }
}

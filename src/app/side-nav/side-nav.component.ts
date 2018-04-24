import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebaseService/firebase.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  rests;
  restsObj;
  restID;
  constructor(private fb: FirebaseService) {
    this.initRests();
  }

  ngOnInit() {
    this.fb.restID.subscribe(message => this.restID = message);
    this.restsObj = document.getElementById('rests') as HTMLSelectElement;
    this.restsObj.addEventListener('change', this.restsChange.bind(this));
  }
  display() {
    const menu = document.getElementById('sideBar') as HTMLButtonElement;
    if (menu.style.display === 'block') {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
  }
  async initRests() {
    let temp;
    await this.fb.fs.doc('Users/shahar-test')
      .get()
      .then(function(data) {
        temp = data.data().rests;
      }).catch( err => {
        console.error(err);
      });
      this.rests = temp;
      console.log(this.rests);
  }
  restsChange() {
    this.fb.changeRestID(this.restsObj.value);
    console.log('changed to value', this.fb.restID);
  };
}

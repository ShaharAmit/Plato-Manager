import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebaseService/firebase.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  rest: Object[];
  restsObj;
  restID;
  constructor(private fb: FirebaseService) {

  }

  ngOnInit() {

  }
}

  
  

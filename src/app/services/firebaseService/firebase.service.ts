import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let messaging: firebase.messaging.Messaging = null;

@Injectable()
export class FirebaseService {
  fs: firebase.firestore.Firestore;
  url: string;
  restRoot: string;
  private restIDSource = new BehaviorSubject<string>('');
  restID = this.restIDSource.asObservable();

  constructor(@Inject(FirebaseApp) private firebaseApp: firebase.app.App, private http: HttpClient) {
    this.fs = firebase.firestore(this.firebaseApp);
    messaging = firebase.messaging(this.firebaseApp);
    this.getMessaging();
    this.url = 'https://us-central1-plato-9a79e.cloudfunctions.net/registerToRest';
    this.restRoot = 'RestAlfa';
  }

  async getCol(path: string) {
    const obj: Object[] = [];
    await this.fs.collection(path)
      .get()
      .then(function (data) {
        data.forEach(docs => {
          obj.push({'id' : docs.id, 'data' : docs.data()});
        });
      }).catch(err => {
        console.error(err);
      });
    return obj;
  }

  async getDoc(path: string) {
    const obj: Object[] = [];
    await this.fs.doc(path)
      .get()
      .then(function (data) {
        obj.push({'data' : data.data()});
      }).catch(err => {
        console.error(err);
      });
    return obj;
  }
  getMessaging() {
    messaging.usePublicVapidKey('BBGVrxUbxkpVZ34MzaP58YDLSFci9tSq92Qb47LwZx1uPMp6loMpAHk03n1690-M8AJP9f-GS14jPXkTpseZinE');
    messaging.requestPermission()
      .then(function() {
        console.log('have permission');
        return messaging.getToken();
      }).then(token => {
        console.log(token);
        this.http.get(this.url + '?rest=' + this.restID + '&token=' + token).subscribe(data => {
          console.log(data);
        });
      }).catch(err => {
        console.error(err);
      });
      messaging.onMessage(function(payload) {
        console.log('onMessage', payload);
      });
  }

  changeRestID(message: string) {
    this.restIDSource.next(message);
  }

}

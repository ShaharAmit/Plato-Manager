import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FirebaseService {
  functions: firebase.functions.Functions;
  fs: firebase.firestore.Firestore;
  url: string;
  restRoot: string;
  auth: firebase.auth.Auth;
  private restIDSource = new BehaviorSubject<string>('');
  restID = this.restIDSource.asObservable();
  uid = null;
  name = null;
  messaging: firebase.messaging.Messaging;
  hasRest: Boolean = false;

  constructor(@Inject(FirebaseApp) private firebaseApp: firebase.app.App, private http: HttpClient) {
    const settings = {timestampsInSnapshots: true};
    this.fs = firebase.firestore(this.firebaseApp);
    this.fs.settings(settings);
    this.auth = firebase.auth(this.firebaseApp);
    this.functions = firebase.functions(this.firebaseApp);
    // this.getMessaging();
    this.url = 'https://us-central1-plato-9a79e.cloudfunctions.net/registerToRest';
    this.restRoot = 'RestAlfa';

    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.name = user.displayName;
        this.uid = user.uid;
        this.getMessaging();
      } else {
        this.messaging = null;
        this.name = null;
        this.uid = null;
      }
    });
  }

  async getMessaging() {
    this.messaging = firebase.messaging(this.firebaseApp);
    await this.messaging.usePublicVapidKey('BBGVrxUbxkpVZ34MzaP58YDLSFci9tSq92Qb47LwZx1uPMp6loMpAHk03n1690-M8AJP9f-GS14jPXkTpseZinE');
    this.messaging.requestPermission()
      .then(() => {
        console.log('have permission');
        return this.messaging.getToken();
      })
        .then(token => {
          console.log(token);
        })
          .then(() => {
            this.messaging.onMessage(payload => {
              console.log('onMessage', payload);
            });
          })
            .catch(err => {
              console.error(err);
            });
  }

  changeRestID(message: string) {
    this.restIDSource.next(message);
  }

  async firebaseLogin(email, password) {
    return this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
      })
        .catch(err => {
          console.error(err);
          return false;
        });
  }
  // async test() {
  //   const addMessage = firebase.functions().httpsCallable('addMessage');
  //     addMessage({text: 'test'}).then((result) => {
  //     // Read result of the Cloud Function.
  //     const sanitizedMessage = result.data.text;
  //   });
  // }
}

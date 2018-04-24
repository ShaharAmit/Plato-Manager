importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


firebase.initializeApp({
    "apiKey": "AIzaSyC17LboYF2DtS34_J_FCKGEhPL5ozf3CHo",
    "authDomain": "plato-9a79e.firebaseapp.com",
    "databaseURL": "https://plato-9a79e.firebaseio.com",
    "projectId": "plato-9a79e",
    "storageBucket": "plato-9a79e.appspot.com",
    "messagingSenderId": "428535021409"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    const title = 'testing';
    const options = {
        body: payload.data.status
    }
  return self.registiration.showNotification(titile,options);
});


    
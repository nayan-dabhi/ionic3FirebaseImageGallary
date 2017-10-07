import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {

  public authState: any = null;
  public mUserId: any = null;
  public mUserEmail: any = null;

  constructor() {

  }

  setUserId(userId) {
    this.mUserId = userId;
  }
  getUserId() {
    return this.mUserId;
  }

  setUserEmail(email) {
    this.mUserEmail = email;
  }
  getUserEmail() {
    return this.mUserEmail;
  }

  loginUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(newUser => {
      firebase.database().ref('/userProfile').child(newUser.uid)
        .set({ email: email, uid: newUser.uid });
    });
  }
}

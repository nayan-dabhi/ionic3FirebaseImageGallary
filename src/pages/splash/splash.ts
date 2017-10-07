import { Component } from '@angular/core';
import { NavController, MenuController, AlertController, Platform } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { AuthProvider } from '../../providers/AuthProvider';
import { DashboardPage } from '../dashboard/dashboard';
import { ConnectionPage } from '../connection/connection';
import { LoginPage } from '../login/login';

import * as firebase from 'firebase';

// declare var cordova: any;

@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html'
})

export class SplashPage {

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public platform: Platform,
    public authService: AuthProvider) {
  }

  ionViewDidEnter() {
    this.appConfig.menuSwipeEnable(false);

    this.platform.ready().then((readySource) => {
      this.setPageRedirect();
    });
  }

  ionViewWillLeave() {
  }

  setPageRedirect() {
    if (this.appConfig.hasConnection()) {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          this.navCtrl.setRoot(LoginPage);
          unsubscribe();
        } else {
          this.authService.setUserId(user.uid);
          this.authService.setUserEmail(user.email);
          this.navCtrl.setRoot(DashboardPage);
          unsubscribe();
        }
      });
    } else {
      this.navCtrl.push(ConnectionPage);
    }

  }

  showNetworkAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: "Exit",
        handler: data => {
          this.appConfig.exitApp();
        }
      }, {
          text: "Retry",
          handler: data => {
            setTimeout(time => {
              this.setPageRedirect();
            }, 1000);
          }
        }]
    });

    alert.present();
  }

}

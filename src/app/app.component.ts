import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase';

import { AuthProvider } from '../providers/AuthProvider';
import { AppConfig, AppMsgConfig } from '../providers/AppConfig';

import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UploadImagePage } from '../pages/upload-image/upload-image';


@Component({
  templateUrl: 'app.html'
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{ title: string, component: any, iconSrc: string }> = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authService: AuthProvider,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public menuCtrl: MenuController) {
    this.initializeApp();

    this.setMenuItems();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.appConfig.isRunOnMobileDevice()) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }

      var config = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
      };

      firebase.initializeApp(config);

      this.rootPage = SplashPage;
    });
  }

  setMenuItems() {
    this.pages = [];
    this.pages.push({ title: 'Dashboard', component: DashboardPage, iconSrc: 'assets/icon/menu/dashboard.png' });
    this.pages.push({ title: 'Upload Image', component: UploadImagePage, iconSrc: 'assets/icon/menu/upload.png' });
  }

  openPage(page) {
    this.menuCtrl.close();
    this.nav.setRoot(page.component);
  }

  doLogout(){
    if (this.appConfig.hasConnection()) {
      firebase.auth().signOut();

      setTimeout(()=> {
        this.nav.setRoot(LoginPage);
      }, 1000);
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}

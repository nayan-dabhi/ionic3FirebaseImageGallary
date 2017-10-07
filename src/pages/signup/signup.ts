import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { AuthProvider } from '../../providers/AuthProvider';

import { DashboardPage } from '../dashboard/dashboard';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  public signupData = {
    email: '',
    password: '',
    passwordRetyped: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public authProviderCtrl: AuthProvider) {
    if (this.navParams != null && this.navParams.data != "") {
      if (this.navParams.data.email != null && this.navParams.data.email != "") {
        this.signupData.email = this.navParams.data.email;
      }
    }
  }

  signup() {
    if (this.signupData.password !== this.signupData.passwordRetyped) {
      this.appConfig.showAlertMsg("Error", "Your password and your re-entered password does not match each other.");
      return;
    }

    if (this.appConfig.hasConnection()) {
      this.authProviderCtrl.signupUser(this.signupData.email, this.signupData.password).then(auth => {
        this.navCtrl.setRoot(DashboardPage);
      }).catch(error => {
        this.appConfig.showAlertMsg("Error", error.message);
      });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}

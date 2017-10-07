import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AppConfig, AppMsgConfig } from '../../providers/AppConfig';
import { AuthProvider } from '../../providers/AuthProvider';

import { SignupPage } from '../signup/signup';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  public loginData = {
    email: '',
    password: ''
  };

  constructor(
    public navCtrl: NavController,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public authProviderCtrl: AuthProvider) {
  }

  openSignUpPage() {
    this.navCtrl.push(SignupPage, {
      email: this.loginData.email
    });
  }

  doLogin() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.authProviderCtrl.loginUser(this.loginData.email, this.loginData.password).then((data) => {
        this.appConfig.hideLoading();

        this.authProviderCtrl.setUserId(data.uid);
        this.authProviderCtrl.setUserEmail(data.email);

        setTimeout(() => {
          this.navCtrl.setRoot(DashboardPage);
        }, 500);
      }).catch(err => {
        this.appConfig.hideLoading();
        this.appConfig.showToast(err.message, "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast(this.appMsgConfig.NoInternetMsg, "bottom", 3000, true, "Ok", true);
    }
  }

}

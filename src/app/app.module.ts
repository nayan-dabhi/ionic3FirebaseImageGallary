import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

// Native Plugins
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';


import { MyApp } from './app.component';
import { SplashPage } from '../pages/splash/splash';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UploadImagePage } from '../pages/upload-image/upload-image';

import { AppConfig, AppMsgConfig } from '../providers/AppConfig';
import { AuthProvider } from '../providers/AuthProvider';
import { DashboardService } from '../providers/dashboard/dashboard-service';

@NgModule({
  declarations: [
    MyApp,
    SplashPage,
    LoginPage,
    SignupPage,
    DashboardPage,
    UploadImagePage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'md-arrow-back',
      tabsHighlight: true,
      tabsPlacement: 'top',
      tabsHideOnSubPages: true
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SplashPage,
    LoginPage,
    SignupPage,
    DashboardPage,
    UploadImagePage,
  ],
  providers: [
    AppConfig,
    AppMsgConfig,
    AuthProvider,
    DashboardService,
    Device,
    Network,
    StatusBar,
    SplashScreen,
    Toast,
    Camera,
    File,
    FilePath,
    FileTransfer,
    FileOpener,
    AppVersion,
    InAppBrowser,
    PhotoViewer,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule { }

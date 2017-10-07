import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController } from 'ionic-angular';

import * as firebase from 'firebase';
import { AppConfig } from '../../providers/AppConfig';
import { AuthProvider } from '../../providers/AuthProvider';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { DashboardPage } from '../dashboard/dashboard';


@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})


export class UploadImagePage {
  public mUserId: any;
  public imageList: any = [];
  public userProfileRef: firebase.database.Reference;

  public imagePath: string = "";
  public isFileSelected: boolean = false;
  public fileTransfer: FileTransferObject = this.transfer.create();


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public camera: Camera,
    public transfer: FileTransfer,
    public file: File,
    public photoViewer: PhotoViewer,
    public filePath: FilePath,
    public appConfig: AppConfig,
    public authService: AuthProvider) {
  }

  ionViewDidLoad() {
    this.imagePath = "assets/img/img-icon.png";

    if (this.authService.getUserId() != null && this.authService.getUserId() != "") {
      this.mUserId = this.authService.getUserId();
    }
  }

  openCameraActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.DestinationType.DATA_URL);
        }
      }, {
        text: 'Use Camera',
        handler: () => {
          this.captureImage(this.camera.PictureSourceType.CAMERA, this.camera.DestinationType.DATA_URL);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    });

    if (this.appConfig.isRunOnMobileDevice()) {
      actionSheet.present();
    } else {
      actionSheet.dismiss();
      this.appConfig.showToast("Camera plugin does not work in browser.", "bottom", 3000, true, "Ok", true);
    }
  }

  captureImage(sourceType, destinationType) {
    if (this.appConfig.isRunOnMobileDevice()) {
      let cameraOption = {
        // allowEdit: true,
        sourceType: sourceType, // this.camera.PictureSourceType.CAMERA,
        destinationType: destinationType, // this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        quality: 100,
        targetWidth: 1000,
        targetHeight: 1000,
        correctOrientation: true,
        // saveToPhotoAlbum: true
      }

      this.camera.getPicture(cameraOption).then((resultData) => {
        if (destinationType == this.camera.DestinationType.DATA_URL) {
          this.imagePath = "data:image/jpeg;base64," + resultData;
          this.isFileSelected = true;
        } else if (destinationType == this.camera.DestinationType.FILE_URI) {

          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(resultData)
              .then(filePath => {
              });
          } else {

          }
        }
      }, (err) => {
        this.appConfig.showToast(err, "bottom", 3000, true, "Ok", true);
      });
    } else {
      this.appConfig.showToast("Camera plugin does not work in browser.", "bottom", 3000, true, "Ok", true);
    }
  }

  public createFileName() {
    return "img_" + new Date().getTime() + ".jpg";
  }

  public uploadImageWithFirebase() {
    let loader = this.loadingCtrl.create({
      content: "Uploading Image, Please Wait...",
    });

    loader.present();

    let storageRef = firebase.storage().ref();
    let databaseRef = firebase.database().ref();

    try {
      const filename = "img_" + Math.floor(Date.now() / 1000);

      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`images/${this.mUserId}/${filename}.jpg`);
      imageRef.putString(this.imagePath, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {

        databaseRef.child('images/' + this.mUserId).push({
          imageUrl: snapshot.downloadURL,
        }).then(() => {
          loader.dismiss();
          this.imagePath = "assets/img/img-icon.png";
          this.isFileSelected = false;
          this.appConfig.showToast("File Uploaded...", "bottom", 3000, true, "Ok", true);

          setTimeout(()=> {
            this.navCtrl.setRoot(DashboardPage);
          }, 300);
        }).catch((e) => {
          loader.dismiss();
          this.appConfig.showToast("File not uploaded..", "bottom", 3000, true, "Ok", true);
        })
      });
    } catch (e) {
      loader.dismiss();
      this.appConfig.showToast("File not uploaded..", "bottom", 3000, true, "Ok", true);
    }
  }

  openImageView() {
    if (this.isFileSelected) {
      this.photoViewer.show(this.imagePath);
    }
  }

}

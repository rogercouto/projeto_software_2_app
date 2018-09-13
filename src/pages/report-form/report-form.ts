import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MyApp } from '../../app/app.component';

/**
 * Generated class for the ReportFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-form',
  templateUrl: 'report-form.html',
})
export class ReportFormPage {

  //protected photo :string = "assets/imgs/image-regular.png";
  protected photo :string = null;

  constructor(
    public navCtrl: NavController
    ,private camera: Camera
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportFormPage');
  }

  sendReport(){
    MyApp.presentAlert("Localização",JSON.stringify(MyApp.location));
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photo = imageData;
    }, (err) => {
      // Handle error
    });
    /*
    */
  }

  openGallery(){
    
  }

}

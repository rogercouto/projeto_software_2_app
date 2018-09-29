import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MyApp } from '../../app/app.component';
import { Report, Category } from '../../model';
import { ReportServiceProvider } from '../../providers';

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
  protected errorDescr = false;
  protected errorAddress = false;

  protected category : Category = null;
  protected report : Report = new Report();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public reportService : ReportServiceProvider,
    public events: Events,
    private camera: Camera
  ) {
    this.category = this.navParams.get('selectedCategory');
    this.report.address = MyApp.location.street;
    if (MyApp.location.number != null && MyApp.location.number != undefined)
      this.report.address += ", "+MyApp.location.number;
  }

  ionViewDidLoad() {
    this.events.subscribe("page:set", (page)=>{
      this.navCtrl.setRoot(page);
    });
  }

  sendReport(){
    this.report.lat = MyApp.location.lat;
    this.report.lng = MyApp.location.lng;
    this.report.entityId = MyApp.entity.id;
    this.report.userId = MyApp.user.id;
    this.report.categoryId = this.category.id;
    this.reportService.sendReport(this.report);
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.report.photo = imageData;
    }, (err) => {
      MyApp.presentAlert("Erro", JSON.stringify(err));
    });
  }

  selectPhoto(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.report.photo = imageData;
    }, (err) => {
      MyApp.presentAlert("Erro", JSON.stringify(err));
    });
  }

  changeDescr(){
    this.errorDescr = false;
  }

  checkDescr(){
    this.errorDescr = (this.report.description == null || this.report.description == "");  
    this.checkForm();
  }

  changeAddress(){
    this.errorAddress = false;
  }

  checkAddress(){
    this.errorAddress = (this.report.address == null || this.report.address == "");
    this.checkForm();
  }

  checkForm():boolean{
    return (this.report.description != null &&
      this.report.description != "" &&
      this.report.address != null &&
      this.report.address != "");
  }

}

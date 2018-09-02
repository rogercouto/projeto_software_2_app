import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ReportPage } from '../index';

import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected city : string = "";

  constructor(
    public navCtrl: NavController
  ) {
  }

  ngOnInit(){
    if (MyApp.location.city != null)
      this.city = MyApp.location.city+" - "+MyApp.location.state;
  }

  ionViewDidLoad() {
  }

  reportPage(){
    MyApp.getLocation(false);
    this.navCtrl.push(ReportPage);
  }

  haveSupport():boolean{
    return true;
  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ReportPage } from '../index';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private _town : string = "Santa Maria - RS";

  constructor(public navCtrl: NavController) {

  }

  reportPage(){
    this.navCtrl.push(ReportPage);
  }

  town():string{
    return this._town;
  }

  haveSupport():boolean{
    return true;
  }
  
}

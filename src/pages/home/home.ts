import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ReportPage } from '../index';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected city : string = "(Aguardando localização do dispositivo...)";

  constructor(
    public navCtrl: NavController
  ) {
    if (MyApp.location != null)
      this.city = MyApp.location.city+" - "+MyApp.location.state;

    if (MyApp.entity != null){
      this.city = MyApp.entity.city.name+" - "+MyApp.entity.city.state.uf;
    }
  }
  
  ngOnInit(){    
  }

  ionViewDidLoad() {
    //console.log(this.city);
  }

  reportPage(){
    this.navCtrl.push(ReportPage);
  }

  canReport():boolean{
    return (MyApp.entity != null);
  }

}

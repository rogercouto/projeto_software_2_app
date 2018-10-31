import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { ReportPage } from '../index';
import { MyApp } from '../../app/app.component';
import { Entity, Location } from '../../model';
import { ReportServiceProvider } from '../../providers';
import { LocalsPage } from '../locals/locals';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected city : string = " ";

  protected entityId : number;
  
  constructor(
    public navCtrl: NavController,
    public reportService : ReportServiceProvider,
    public events : Events
  ) {
    if (MyApp.entity != null){
      this.entityId = MyApp.entity.id;
      this.city = MyApp.entity.city.name+" - "+MyApp.entity.city.state.uf;
    }else if (MyApp.location != null){
      this.city = MyApp.location.city+" - "+MyApp.location.uf;
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

  isLocationSet():boolean{
    return MyApp.entity != null;
  }

  haveLocation():boolean{
    return MyApp.location != null;
  }

  getEntity():Entity{
    for (let entity of MyApp.entities){
      if (this.entityId == entity.id)
        return entity;
    }
    return null;
  }

  get entities(){
    return MyApp.entities;
  }

  selectEntity(){
    MyApp.entity = this.getEntity();
    const location = new Location();
    location.city = MyApp.entity.city.name;
    location.uf = MyApp.entity.city.state.uf;
    location.street = "";
    MyApp.location = location;
  }

  findLocal(){
    this.navCtrl.push(LocalsPage, {redirect: HomePage});
  }

  cannotLocate():boolean{
    return MyApp.cannotLocate;
  }

  showSelectButton():boolean{
    return MyApp.cannotLocate;
  }

}


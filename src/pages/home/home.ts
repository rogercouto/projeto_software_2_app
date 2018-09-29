import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { ReportPage } from '../index';
import { MyApp } from '../../app/app.component';
import { Entity, Location } from '../../model';
import { ReportServiceProvider } from '../../providers';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected city : string = "(Aguardando localização do dispositivo...)";

  protected entityId : number;
  
  constructor(
    public navCtrl: NavController,
    public reportService : ReportServiceProvider,
    public events : Events
  ) {
    if (MyApp.location != null)
      this.city = MyApp.location.city+" - "+MyApp.location.uf;
    if (!MyApp.autoLocation){
      if (MyApp.entity != null)
        this.entityId = MyApp.entity.id;
    }
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

  isAutoLocation():boolean{
    return MyApp.autoLocation;
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
    this.reportService.publishAll();
    /*
    */
  }

}


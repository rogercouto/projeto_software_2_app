import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import { ReportPage } from '../index';
import { MyApp } from '../../app/app.component';
import { Entity, Location, Report, Update } from '../../model';
import { ReportServiceProvider } from '../../providers';
import { LocalsPage } from '../locals/locals';
import { ReportDetailsPage } from '../report-details/report-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  protected city : string = " ";

  protected entityId : number;

  protected otherReports : Array<Report> = new Array<Report>();

  constructor(
    public navCtrl: NavController,
    public reportService : ReportServiceProvider,
    public events : Events
  ) {
    if (MyApp.entity != null){
      this.entityId = MyApp.entity.id;
      this.city = MyApp.entity.city.name+" - "+MyApp.entity.city.state.uf;
      this.getReports();
    }else if (MyApp.location != null){
      this.city = MyApp.location.city+" - "+MyApp.location.uf;
    }
    this.events.subscribe('entity:publish',(entity)=>{
      console.log(entity);
      this.getReports();
    });
  }

  openDetails(report: Report){
    const resp = this.reportService.getUpdates(report);
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    resp.subscribe(
      apiUpdates =>{
        const updates = new Array<Update>();
        for (let apiUpdate of apiUpdates){
          const update = new Update();
          update.id = apiUpdate.id;
          update.description = apiUpdate.description;
          update.reportId = apiUpdate.report_id;
          update.userId = apiUpdate.user_id;
          update.createdAt = new Date(apiUpdate.created_at);
          updates.push(update);
        }
        report.updates = updates;
        loader.dismiss();
        this.navCtrl.push(ReportDetailsPage, {report: report});
      },
      error => {
        loader.dismiss();
        MyApp.presentAlert("Erro", error);
      }
    );
  }

  
  ngOnInit(){    
  }

  ionViewDidLoad() {
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
    this.getReports();
  }

  getReports(){
    this.reportService.publishAll();
    this.events.subscribe("reports:get", (reports)=>{
      if (reports != null){
        this.sortReports(reports);
        this.otherReports = new Array<Report>();
        for (let report of reports){
          if(MyApp.user.id != report.userId && report.status == 1){
            this.otherReports.push(report);
          }
        }
      }
    })
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

  sortReports(reports : Array<Report>){
    if (reports == null)
      return;
    return reports.sort((report1, report2) => {
      if (report1.id < report2.id) {
          return 1;
      }
      if (report1.id > report2.id) {
          return -1;
      }
      return 0;
    });
  }
  
}


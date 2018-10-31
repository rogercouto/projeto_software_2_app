import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { ReportDetailsPage, ReportPage } from '../'
import { MyApp } from '../../app/app.component';
import { Report, Update } from '../../model';
import { ReportServiceProvider } from '../../providers';
/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  protected sel: string = "mines";
  protected mineReports = new Array<Report>();
  protected otherReports = new Array<Report>();

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService: ReportServiceProvider, public events: Events) {
    const loading = MyApp.loadingController.create({content:"Aguarde..."});
    loading.present();
    this.reportService.publishAll();
    this.events.subscribe("reports:get", (reports)=>{
      if (reports != null){
        this.sortReports(reports);
        for (let report of reports){
          if (MyApp.user.id == report.userId){
            this.mineReports.push(report);
          }else if(report.status != 3){
            this.otherReports.push(report);
          }
        }
      }
      loading.dismiss();
    })
  }

  ionViewDidLoad() {
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
    
    /*
    const resp = this.reportService.getReactions(report.id);
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    resp.subscribe(
      apiReactions =>{
        for (let apiReaction of apiReactions){
          const reaction = new Reaction();
          reaction.id = apiReaction.id;
          reaction.reaction = apiReaction.reaction == 1? true : false;
          reaction.comment = apiReaction.comment;
          reaction.userId = apiReaction.user_id;
          reaction.reportId = apiReaction.report_id;
          report.reactions.push(reaction);
        }
        loader.dismiss();
        this.navCtrl.push(ReportDetailsPage, {report: report});
      },
      error => {
        loader.dismiss();
        MyApp.presentAlert("Erro", error);
      }
      );
     */ 
    //this.navCtrl.push(ReportDetailsPage, {report: report});

    /*
    this.reportService.publishReactions(report);
    this.events.subscribe('reactions:get', (reactions)=>{
      report.reactions = reactions;
      this.navCtrl.push(ReportDetailsPage, {report: report});
    })
    */
  }

  report(){
    this.navCtrl.push(ReportPage);
  }

  canReport(){
    return (MyApp.entity != null);
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

import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { File, FileEntry } from '@ionic-native/file';
import { Report, Reaction } from '../../model';
import { MyApp } from '../../app/app.component';
import { Events } from 'ionic-angular';
import { ReportsPage } from '../../pages';

/*
  Generated class for the ReportServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReportServiceProvider {

  public readonly REPORT_URL = MyApp.SERVER_URL+"/api/reports";

  public readonly REPORTS_URL = MyApp.SERVER_URL+"/api/reports/entity";

  public readonly REACTION_URL = MyApp.SERVER_URL+"/api/reports/react";

  private loader = null;

  constructor(public http: Http, public file: File, public events : Events) {
  }
  
  sendReport(report : Report){
    this.loader = MyApp.loadingController.create({content:"Enviando relato..."})
    this.loader.present();
    if (report.photo != null){
      this.file.resolveLocalFilesystemUrl(report.photo)
        .then(entry => (<FileEntry>entry).file(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const formData = new FormData();
            const imgBlob = new Blob([reader.result], {type: file.type});
            formData.append('photo', imgBlob, file.name);
            this.postReport(formData, report);
          } 
          reader.readAsArrayBuffer(file);
        }))
        .catch(error => {
          this.loader.dismiss();
          MyApp.presentAlert("Erro", JSON.stringify(error));
        });
    }else{
      const formData = new FormData();
      formData.append('photo', null);
      this.postReport(formData, report);
    }
  }

  private postReport(formData: FormData, report: Report){
    formData.append('description',report.description)
    formData.append('address', report.address);
    formData.append('user_id', report.userId.toString());
    formData.append('entity_id', report.entityId.toString());
    formData.append('category_id', report.categoryId.toString());
    formData.append('lat', report.lat.toString());
    formData.append('lng', report.lng.toString());  
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', MyApp.user.token.tokenType+ ' ' + MyApp.user.token.accessToken );
    this.http.post(this.REPORT_URL, formData, {headers:headers})
    .map(res => res.json())
    .catch(error => Observable.throw(error))
    .subscribe(
      data => {
        this.loader.dismiss();
        MyApp.presentAlert("Sucesso", "Relato enviado!");
        //MyApp.presentAlert("Sucesso", JSON.stringify(data));
        report.positiveReactions = 0;
        report.negativeReactions = 0;
        report.photo = data.photo;
        report.createdAt = new Date(data.created_at);
        this.events.publish("page:set",ReportsPage);
      },
      error => {
        this.loader.dismiss();
        MyApp.presentAlert("Erro", JSON.stringify(error));
      }
    );
  }
  
  getAll():Observable<any>{
    if (MyApp.entity == null)
      return new Observable<any>();
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.REPORTS_URL+"/"+MyApp.entity.id, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  publishAll(){
    const resp = this.getAll();
    resp.subscribe(
      apiReports => {
        const reports = new Array<Report>();
        for (let apiReport of apiReports){
          if (apiReport.closing_date == null){
            const report = ReportServiceProvider.create(apiReport);
            reports.push(report);
          }
        }
        this.events.publish("reports:get",reports);
      },
      error => {
        MyApp.presentAlert("Erro", error);
        this.events.publish("reports:get",null);
      }
    );
  }

  postReaction(reaction : Reaction){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    const data = {
      reaction : (reaction.reaction)?1:0,
      comment : reaction.comment,
      user_id : MyApp.user.id,
      report_id : reaction.reportId
    }
    this.loader = MyApp.loadingController.create({content:"Aguarde..."})
    this.http.post(this.REACTION_URL, data, {headers:headers})
    .map(res => res.json())
    .catch(error => Observable.throw(error))
    .subscribe(
      data => {
        this.loader.dismiss();
        this.events.publish('react:post', data);
      },
      error => {
        this.loader.dismiss();
        MyApp.presentAlert("Erro", JSON.stringify(error));
      }
    );
  }

  getReactions(reportId : number):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.REACTION_URL+"/"+reportId, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  deleteReaction(reaction : Reaction){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    const resp = this.http.delete(this.REACTION_URL+"/"+reaction.id, {headers:headers})
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    resp.subscribe(
      (conf)=>{
        if (conf){
          loader.dismiss();
        }
      },(error)=>{
        loader.dismiss();
        MyApp.presentAlert("Erro", JSON.stringify(error));
      }
    );  
  }

  getUpdates(report : Report):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.REPORT_URL+"/"+report.id+"/status", {headers:headers})
    .map(response => response.json()) 
    .catch(error => Observable.throw(error));;
  }

  getOne(reportId : number):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.REPORT_URL+"/"+reportId, {headers:headers})
    .map(response => response.json()) 
    .catch(error => Observable.throw(error));;
  }

  static create(apiReport : any):Report{
    const report = new Report();
    report.id = apiReport.id;
    report.description = apiReport.description;
    report.address = apiReport.address;
    report.photo = apiReport.photo;
    report.userId = apiReport.user_id;
    report.entityId = apiReport.entity_id;
    report.categoryId = apiReport.category_id;
    report.lat = apiReport.lat;
    report.lng = apiReport.lng;
    report.createdAt = new Date(apiReport.created_at);
    report.status = apiReport.status;
    report.positiveReactions = 0;
    report.negativeReactions = 0;
    for(let apiReaction of apiReport.positives){
      const reaction = new Reaction();
      reaction.id = apiReaction.id;
      reaction.reaction = true;
      reaction.comment = apiReaction.comment;
      reaction.reportId = apiReaction.report_id;
      reaction.userId = apiReaction.user_id;
      report.reactions.push(reaction);
      report.positiveReactions++;
    }
    for(let apiReaction of apiReport.negatives){
      const reaction = new Reaction();
      reaction.id = apiReaction.id;
      reaction.reaction = false;
      reaction.comment = apiReaction.comment;
      reaction.reportId = apiReaction.report_id;
      reaction.userId = apiReaction.user_id;
      report.reactions.push(reaction);
      report.negativeReactions++;
    }
    return report;
  }

}

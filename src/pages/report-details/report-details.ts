import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Report, Reaction } from '../../model';
import { MyApp } from '../../app/app.component';
import { ReportServiceProvider } from '../../providers';

/**
 * Generated class for the ReportDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-details',
  templateUrl: 'report-details.html',
})
export class ReportDetailsPage {

  protected report : Report;
  protected mine : boolean = true; //my report?
  protected supported : boolean = false;
  protected denounced : boolean = false;
  protected reaction : Reaction = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl : AlertController, private reportService : ReportServiceProvider) {
    this.report = navParams.get('report');
    if (this.report.userId != MyApp.user.id){
      this.mine = false;
      for (let reaction of this.report.reactions){
        if (reaction.userId == MyApp.user.id){
          this.reaction = reaction;
          if (reaction.reaction){
            this.supported = true;
          }else{
            this.denounced = true;
          }
        }
      }
    }
  }

  ionViewDidLoad() {
  }

  support() {
    if (this.supported){
      this.report.positiveReactions--;
      this.supported = false;
      this.reportService.deleteReaction(this.reaction);
      this.report.removeReaction(this.reaction);
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Apoiar',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comentário (Opcional)'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            const reaction = new Reaction();
            if (reaction.comment != "")
              reaction.comment = data.comment;
            else
              reaction.comment = null;  
            reaction.reaction = true;
            reaction.userId = MyApp.user.id;
            reaction.reportId = this.report.id;
            //save reaction
            this.reportService.postReaction(reaction);
            this.report.reactions.push(reaction);
            this.report.positiveReactions++;
            this.supported = true;
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  denounce(){
    if (this.denounced){
      this.report.negativeReactions--;
      this.denounced = false;
      this.reportService.deleteReaction(this.reaction);
      this.report.removeReaction(this.reaction);
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Denunciar',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Motivo'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          role: null,
          handler: data => {
            if (data.comment != ""){
              const reaction = new Reaction();
              reaction.comment = data.comment;
              reaction.reaction = false;
              reaction.userId = MyApp.user.id;
              reaction.reportId = this.report.id;
              //save reaction
              this.reportService.postReaction(reaction);
              this.report.reactions.push(reaction);
              this.report.negativeReactions++;
              this.denounced = true;
            }else{
              MyApp.presentAlert("Aviso", "Motivo para a denúncia deve ser informado!");
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    });
    alert.present();
  }

  supportColor(){
    return (this.supported)?"secondary":"light";
  }

  denounceColor(){
    return (this.denounced)?"danger":"light";
  }

}

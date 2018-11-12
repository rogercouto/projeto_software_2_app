import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { NotificationServiceProvider, ReportServiceProvider, ContactServiceProvider } from '../../providers';
import { Notification, Report, Reaction, Update } from '../../model';
import { MyApp } from '../../app/app.component';
import { ReportDetailsPage } from '../report-details/report-details';
import { MessageDetailsPage } from '../message-details/message-details';
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  protected notifications : Array<Notification> = new Array<Notification>();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public notificationService: NotificationServiceProvider,
    public reportService: ReportServiceProvider,
    public contactService: ContactServiceProvider,
    public events: Events) 
    {
    const loader = MyApp.loadingController.create({content:"Aguarde..."});
    loader.present();
    const resp = this.notificationService.getNotifications();
    resp.subscribe(
      apiNotifications=>{
        for (let apiNotification of apiNotifications){
          const notification : Notification = new Notification();
          notification.id = apiNotification.id;
          notification.title = apiNotification.title;
          notification.content = apiNotification.content;
          notification.status = apiNotification.status;
          notification.userId = apiNotification.user_id;//useless?
          notification.reportId = apiNotification.report_id;
          notification.contactId = apiNotification.contact_id; //later use
          this.notifications.push(notification);
        }
        this.notifications = this.notifications.reverse();
        loader.dismiss();
      }
      ,error=>{
        MyApp.presentAlert("Erro", JSON.stringify(error));
        loader.dismiss();
      }
    );
  }

  ionViewDidLoad() {
  }

  openDetails(notification:Notification){
    const update = (notification.status == 0)?true:false;
    for(let i = 0; i < this.notifications.length; i++){
      if (this.notifications[i].id == notification.id)
        this.notifications[i].status = 1;
    }
    if (update)
      this.events.publish('notification:view',notification);
    if (notification.reportId != null){
      const loader = MyApp.loadingController.create({content:"Aguarde..."});
      loader.present();
      const resp = this.reportService.getOne(notification.reportId);
      resp.subscribe(
        apiReport =>{
          const report : Report = new Report();
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
          const resp2 = this.reportService.getUpdates(report);
          resp2.subscribe(
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
        },
        error=>{
          loader.dismiss();
          MyApp.presentAlert("Erro", JSON.stringify(error));
        }
      );      
    }else if (notification.contactId != null){
      const resp = this.contactService.get(notification.contactId);
      const loader = MyApp.loadingController.create({content:"Aguarde..."});
      loader.present();
      resp.subscribe(
        apiContact=>{
          const contact = ContactServiceProvider.create(apiContact);
          loader.dismiss();
          this.navCtrl.push(MessageDetailsPage, {contact: contact});
        },
        error=>{
          loader.dismiss();
          MyApp.presentAlert("Erro", JSON.stringify(error));
        }
      );
    }
  }

}

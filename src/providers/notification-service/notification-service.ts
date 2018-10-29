import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyApp } from '../../app/app.component';
import { Notification } from '../../model';

/*
  Generated class for the NotificationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationServiceProvider {

  public readonly NOTIFICATIONS_URL = MyApp.SERVER_URL+"/api/notifications/user/all";
  
  public readonly COUNT_URL = MyApp.SERVER_URL+"/api/notifications/user/status/";

  public readonly UPDATE_URL = MyApp.SERVER_URL+"/api/notifications/";

  constructor(public http: Http) {
  }

  getNotifications():Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.NOTIFICATIONS_URL, {headers:headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  getUnreadedCount(){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.COUNT_URL+"0", {headers:headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  setReaded(notification : Notification){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    const data = { status : true }
    return this.http.put(this.UPDATE_URL+notification.id, JSON.stringify(data), {headers:headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

}

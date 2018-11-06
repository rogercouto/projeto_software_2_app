import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { MyApp } from '../../app/app.component';
import { Observable } from 'rxjs/Observable';
import { Contact } from '../../model';

/*
  Generated class for the ContactServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactServiceProvider {

  public readonly CONTACT_URL = MyApp.SERVER_URL+"/api/contacts";
  public readonly CONTACTS_URL = MyApp.SERVER_URL+"/api/contacts/user/all";

  constructor(public http: Http) {}

  /**
   * Return all contacts of current user
   */
  getAll():Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.CONTACTS_URL, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  /**
   * Return specific contact
   * @param contactId id of contact to be returned
   */
  get(contactId : number):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.CONTACT_URL, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  /**
   * Send new contact to server
   * @param contact 
   */
  send(contact : Contact){
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    const data = {
      subject : contact.subject,
      content : contact.content,
      user_id : contact.userId,
      entity_id: contact.entityId
    }
    console.log(data);
    return this.http.post(this.CONTACT_URL, data, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  /**
   * Convert data from obserbable to contact
   * @param data data returned from server
   */
  static create(data : any):Contact{
    const contact = new Contact();
    contact.id = data.id;
    contact.subject = data.subject;
    contact.content = data.content;
    contact.userId = data.user_id;
    contact.entityId = data.entity_id;
    return contact;
  }

}

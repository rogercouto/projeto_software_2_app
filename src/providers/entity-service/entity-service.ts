import { Http, Headers }  from '@angular/http';
import { Injectable } from '@angular/core';
import { Token } from '../../model';
import { Observable } from 'rxjs/Observable';
import { MyApp } from '../../app/app.component';

import { Entity, City, State} from '../../model';
import { Events } from 'ionic-angular';

/*
  Generated class for the EntityServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EntityServiceProvider {

  public readonly ENTITY_URL = MyApp.SERVER_URL+"/api/entities";
  
  constructor(public http: Http, private events : Events) {
  }

  gerAll():Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.ENTITY_URL, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  publishAll(){
    const obs = this.gerAll();
        obs.subscribe(apiEntities =>{
          const entities = new Array<Entity>();
          for (let apiEntity of apiEntities){
              const entity = new Entity();
              entity.id = apiEntity.id;
              entity.name = apiEntity.name;
              entity.phone = apiEntity.phone;
              entity.email = apiEntity.email;
              entity.street = apiEntity.street;
              entity.number = apiEntity.number;
              entity.complement = apiEntity.complement;
              entity.city = new City();
              entity.city.id = apiEntity.city.id;
              entity.city.name = apiEntity.city.name;
              entity.city.state = new State();
              entity.city.state.id = apiEntity.city.state.id;
              entity.city.state.uf = apiEntity.city.state.uf;
              entity.city.state.name = apiEntity.city.state.name;
              entities.push(entity);
          }
          this.events.publish('entities:publish', entities);
        });
  }

  getEntity(token: Token, cityName : string):Observable<any>{
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',token.tokenType+' '+token.accessToken);
    return this.http.get(this.ENTITY_URL+"/"+cityName, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  publishEntity(){
    const response = this.getEntity(MyApp.user.token, MyApp.location.city);
      response.subscribe(
        apiEntities =>{
          let entity = null;
          for (let apiEntity of apiEntities){
            if (apiEntity.city.name == MyApp.location.city && apiEntity.city.state.name == MyApp.location.state){
              const apiEntity = apiEntities[0];
              entity = new Entity();
              entity.id = apiEntity.id;
              entity.name = apiEntity.name;
              entity.phone = apiEntity.phone;
              entity.email = apiEntity.email;
              entity.street = apiEntity.street;
              entity.number = apiEntity.number;
              entity.complement = apiEntity.complement;
              entity.city = new City();
              entity.city.id = apiEntity.city.id;
              entity.city.name = apiEntity.city.name;
              entity.city.state = new State();
              entity.city.state.id = apiEntity.city.state.id;
              entity.city.state.uf = apiEntity.city.state.uf;
              entity.city.state.name = apiEntity.city.state.name;
              break;
            }
          }
          this.events.publish('entity:publish', entity);
          if (entity != null){
            const element = document.getElementById('inputcity');
            if (element != null)
              element.textContent = entity.city.name+" - "+entity.city.state.uf;
            const element1 = document.getElementById('btnReport1');
            element1.removeAttribute('disabled');
          }else{
            const element = document.getElementById('spanNoEntity');
              if (element != null)
                element.style.display = "block";
          }
        },
        error =>{
          MyApp.presentAlert("Erro",error);
        }
      );
  }

}

import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyApp } from '../../app/app.component';
import { Category } from '../../model';
import { Events } from 'ionic-angular';
/*
  Generated class for the CategoryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryServiceProvider {

  public readonly CATEGORY_URL = MyApp.SERVER_URL+"/api/categories";

  constructor(public http: Http, public events: Events) {
  }

  getAll():Observable<any>{
    if (MyApp.user == null)
      return null;
    const headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',MyApp.user.token.tokenType+' '+MyApp.user.token.accessToken);
    return this.http.get(this.CATEGORY_URL, {headers:headers})
      .map(response => response.json()) 
      .catch(error => Observable.throw(error));
  }

  publishAll(){
    const resp = this.getAll();
    resp.subscribe(
      apiCategories =>{
        const categories = new Array<Category>();
        for(let apiCategory of apiCategories){
          if (apiCategory.status == 1){
            const category = new Category();
            category.id = apiCategory.id;
            category.name = apiCategory.name;
            category.description = apiCategory.description;
            category.icon = apiCategory.icon != null ? apiCategory.icon : "clipboard";
            categories.push(category);
          }
        }
        this.events.publish("categories:get", categories);
      },
      error=>{
        console.log(error);
      }
    );
  }

}

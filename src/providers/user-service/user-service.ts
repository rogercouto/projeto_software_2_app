import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { User, Token } from '../../model';
/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  public readonly SERVER_URL = "http://cidadeunida.pipelinelab.com.br";
  //public readonly SERVER_URL = "http://127.0.0.1:8000";
  public readonly CLIENT_SECRET = "vzcGTyWPN2csN7v0mHtqpgl8EK1O0tvH84B74D53";
  //public readonly CLIENT_SECRET = "WnNKftBPr31tkqatS1dtIeNWG44AVMUbkLhZRr28";

  public readonly TOKEN_URL = this.SERVER_URL+"/oauth/token";

  public readonly USER_URL = this.SERVER_URL+"/api/user";

  constructor(public http: Http) {
  }

  authenticate(email: string, password: string):Observable<Token>{
    const headers = new Headers();
    headers.append('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('content-type','application/json');
    const data = {
      grant_type: "password",
      client_id: Number(1),
      client_secret: this.CLIENT_SECRET,
      username: email,
      password: password
    }
    return this.http.post(this.TOKEN_URL, JSON.stringify(data), {headers:headers})
      .map(response => response.json() as Token) 
      .catch(error => Observable.throw(error));
  }

  getUser(token : Token):Observable<User>{
    const headers = new Headers();
    headers.append('content-type','application/json');
    headers.append('Accept','application/json');
    headers.append('Authorization',token.token_type+' '+token.access_token);
    return this.http.get(this.USER_URL, {headers:headers})
      .map(response => response.json())
      .catch(error => Observable.throw(error));
  }

  saveLocalUser(user : User){
    localStorage['user'] = JSON.stringify(user);
    localStorage['lastEmail'] = user.email;
  }

  getLocalUser(){
    const data = localStorage['user'];
    if (data){
      const localUser = JSON.parse(data);
      const user = new User();
      user.id = localUser.id;
      user.name = localUser.name;
      user.email = localUser.email;
      user.password = localUser.password;
      const localToken = localUser.token;
      const token = new Token();
      token.access_token = localToken.access_token;
      token.expires_in = localToken.access_token;
      token.refresh_token = localToken.refresh_token;
      token.token_type = localToken.token_type;
      user.token = token;
      return user;
    }
    return null;
  }

  getLastEmail(){
    const data = localStorage['lastEmail'];
    if (data){
      return localStorage['lastEmail'];
    }
    return "";
  }

}

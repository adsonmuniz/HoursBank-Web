import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Type } from '../models/type';

// Services
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TypeService implements OnInit {
  private authentication: Authentication | any;
  private type: Type | any;
  private types: Array<Type> = [];
  private observers: ((type: Type) => void)[] = [];
  private observersArray: ((types: Array<Type>) => void)[] = [];

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.type = { id: 0, description: '', increase: false }
  }

  ngOnInit(): void {
    this.setAuthentication();

    // Adiciona um observador para atualizar a propriedade authentication no componente quando ela for alterada no serviço
    this.loginService.addObserver((authentication: Authentication) => {
      this.authentication = authentication;
    });
  }

  public setAuthentication(): void {
    this.authentication = this.loginService.getAuthentication();
  }

  private httpOptions(): HttpHeaders {
    if (!this.authentication) {
      this.setAuthentication();
    }

    if (this.authentication.authenticated) {
      var token = this.authentication.accessToken;
      var headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      return headers;
    }
    return new HttpHeaders();
  };

  public getTypes() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Type/`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.types = response;

            this.notifyObserversArray(this.types);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
          }
        );
    }
  }

  public getTeamById(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Team/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.type.id = response.id;
            this.type.description = response.description;
            this.type.increase = response.increase;

            this.notifyObservers(this.type);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
          }
        );
    }
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (type: Type) => void) {
    this.observers.push(observer);
  }
  public addObserverArray(observer: (types: Array<Type>) => void) {
    this.observersArray.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (type: Type) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public removeObserverArray(observer: (types: Array<Type>) => void) {
    this.observersArray = this.observersArray.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(type: Type) {
    this.observers.forEach(observer => observer(type));
  }
  private notifyObserversArray(types: Array<Type>) {
    this.observersArray.forEach(observer => observer(types));
  }
}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Coordinator } from '../models/coordinator';

// Services
import { LoadingService } from './loading.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService implements OnInit {
  private authentication: Authentication | any;
  private coordinator: Coordinator | any;
  private coordinators: Array<Coordinator> = [];
  private observers: ((coordinator: Coordinator) => void)[] = [];
  private observersArray: ((coordinators: Array<Coordinator>) => void)[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.coordinator = { id: 0, teamId: 0, userId: 0 }
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

  public getCoordinators() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Coordinator/`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinators = response;
            this.notifyObserversArray(this.coordinators);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public getCoordinatorById(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Coordinator/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinator.id = response.id;
            this.coordinator.userId = response.userId;
            this.coordinator.teamId = response.teamId;

            this.notifyObservers(this.coordinator);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public getCoordinatorByUser(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Coordinator/GetByUser/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinator.id = response.id;
            this.coordinator.userId = response.userId;
            this.coordinator.teamId = response.teamId;

            this.notifyObservers(this.coordinator);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public getCoordinatorByTeam(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Coordinator/GetByTeam/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinator.id = response.id;
            this.coordinator.userId = response.userId;
            this.coordinator.teamId = response.teamId;

            this.notifyObservers(this.coordinator);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public insertCoordinator(coordinator: Coordinator) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}Coordinator/Insert/`, { coordinator: coordinator }, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinator.id = response.id;
            this.coordinator.userId = response.userId;
            this.coordinator.teamId = response.teamId;

            this.notifyObservers(this.coordinator);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public updateCoordinator(coordinator: Coordinator) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.put(`${API_URL}Coordinator/Update/`, { coordinator: coordinator }, { headers: headers })
        .subscribe(
          (response: any) => {
            this.coordinator.id = response.id;
            this.coordinator.userId = response.userId;
            this.coordinator.teamId = response.teamId;

            this.notifyObservers(this.coordinator);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public deleteCoordinator(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.delete<boolean>(`${API_URL}Coordinator/Delete/${id}`, { headers: headers })
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.messageService.setMessage({ text: 'Coordenador removido com sucesso', type: 'info' });
            } else {
              this.messageService.setMessage({ text: 'Não foi possível remover o coordenador', type: 'warning' });
            }
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: 'Ocorreu erro ao tentar remover o coordenador', type: 'error' });
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (coordinator: Coordinator) => void) {
    this.observers.push(observer);
  }
  public addObserverArray(observer: (coordinators: Array<Coordinator>) => void) {
    this.observersArray.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (coordinator: Coordinator) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public removeObserverArray(observer: (coordinators: Array<Coordinator>) => void) {
    this.observersArray = this.observersArray.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(coordinator: Coordinator) {
    this.observers.forEach(observer => observer(coordinator));
  }
  private notifyObserversArray(coordinators: Array<Coordinator>) {
    this.observersArray.forEach(observer => observer(coordinators));
  }
}

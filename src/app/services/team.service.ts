import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Team } from '../models/team';

// Services
import { LoadingService } from './loading.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TeamService implements OnInit {
  private team: Team | any;
  private teams: Array<Team> = [];
  private authentication: Authentication | any;
  private observers: ((team: Team) => void)[] = [];
  private observersArray: ((teams: Array<Team>) => void)[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.team = { id: 0, name: "" };
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

  public getTeams() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Team/`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.teams = response
            this.notifyObserversArray(this.teams);
            //this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  public getTeamsCoordinators() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Team/GetTeamsCoordinators`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.teams = response
            this.notifyObserversArray(this.teams);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
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
            this.team = response;

            this.notifyObservers(this.team);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public getTeamByName(name: string) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      let body = { id: 0, name: name };

      this.http.post(`${API_URL}Team/GetByName`, { team: body }, { headers: headers })
        .subscribe(
          (response: any) => {
            this.team.id = response.id;
            this.team.name = response.name;

            this.notifyObservers(this.team);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public insertTeam(team: Team) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}Team/Insert/`, team, { headers: headers })
        .subscribe(
          (response: any) => {
            this.team.id = response.id;
            this.team.name = response.name;
            this.team.coordinators = response.coordinators;
            this.notifyObservers(this.team);
            this.messageService.setMessage({ text: "Time adicionado com sucesso", type: "info" });
            this.router.navigate(['teams']);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            if (error.status == 400) {
              this.messageService.setMessage({ text: error.error, type: 'warning' });
            }
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  public updateTeam(team: Team) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.put(`${API_URL}Team/Update/`, team, { headers: headers })
        .subscribe(
          (response: any) => {
            this.team.id = response.id;
            this.team.name = response.name;
            this.team.coordinators = response.coordinators;
            this.notifyObservers(this.team);
            this.messageService.setMessage({ text: "Time alterado com sucesso", type: "info" });
            this.router.navigate(['teams']);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  public deleteTeam(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.delete<boolean>(`${API_URL}Team/Delete/${id}`, { headers: headers })
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.getTeamsCoordinators();
              this.notifyObserversArray(this.teams);
              this.messageService.setMessage({ text: 'Time removido com sucesso', type: 'info' });
              this.loadingService.setLoading(false);
            } else {
              this.messageService.setMessage({ text: 'Não foi possível remover o time, existem usuários associados.', type: 'warning' });
            }
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: 'Ocorreu erro ao tentar remover o time', type: 'error' });
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (team: Team) => void) {
    this.observers.push(observer);
  }
  public addObserverArray(observer: (teams: Array<Team>) => void) {
    this.observersArray.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (team: Team) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public removeObserverArray(observer: (teams: Array<Team>) => void) {
    this.observersArray = this.observersArray.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(team: Team) {
    this.observers.forEach(observer => observer(team));
  }
  private notifyObserversArray(teams: Array<Team>) {
    this.observersArray.forEach(observer => observer(teams));
  }
}

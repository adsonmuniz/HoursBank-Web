import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Message } from '../models/message';
import { User } from '../models/user';

// Services
import { LoadingService } from './loading.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  private authentication: Authentication | any;
  private user: User | any;
  private users: Array<User> = [];
  private message: Message | any;
  private observers: ((user: User) => void)[] = [];
  private observersArray: ((users: Array<User>) => void)[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.user = { id: 0, team: 0, name: "", email: "", hours: 0, admin: false, active: false, firstName: "" };
    this.message = { text: '', type: '' };
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

  public getUser() {
    return this.user;
  }

  public setUser(user: any) {
    this.user = user;
    this.notifyObservers(this.user);
  }

  private clearUsersArray() {
    this.users = [];
    this.notifyObserversArray(this.users);
  }

  public getUsers() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get<User[]>(`${API_URL}User/`, { headers: headers })
        .subscribe(
          (response: User[]) => {
            this.clearUsersArray();
            this.users = response;
            this.notifyObserversArray(this.users);
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

  public getUsersToApprove() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get<User[]>(`${API_URL}User/UsersToApprove/`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.users = response;
            this.notifyObserversArray(this.users);
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

  public getUserByToken() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}User/GetByToken/`, { headers })
        .subscribe(
          (response: any) => {
            this.user.id = response.id;
            this.user.name = response.name;
            this.user.email = response.email;
            this.user.password = response.password;
            this.user.confirm = response.password;
            this.user.admin = response.admin;
            this.user.active = response.active;
            this.user.hours = response.hours;
            this.user.teamId = response.teamId;
            this.user.typeId = response.typeId;

            if (response.name.trim()) {
              this.user.firstName = response.name.split(' ')[0];
            }

            this.notifyObservers(this.user);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public getUserById(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}User/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.user.id = response.id;
            this.user.name = response.name;
            this.user.email = response.email;
            this.user.password = response.password;
            this.user.confirm = response.password;
            this.user.admin = response.admin;
            this.user.active = response.active;
            this.user.hours = response.hours;
            this.user.teamId = response.teamId;

            this.notifyObservers(this.user);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public admin() {
    this.IsAdmin();
  }

  private IsAdmin() {
    this.loadingService.setLoading(true);
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}User/IsAdmin`, { headers: headers })
        .subscribe(
          (response: any) => {
            if (!response && this.authentication.user.admin) {
              this.messageService.setMessage({ text: "Foi identificada tentativa de burlar o sistema.", type: "error" });
              localStorage.removeItem('authentication');
              this.loginService.setAuthentication();
              this.router.navigate([""]);
              this.loadingService.setLoading(false);
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public getUserByEmail(email: string) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}User/GetByEmail/${email}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.user.id = response.id;
            this.user.name = response.name;
            this.user.email = response.email;
            this.user.password = response.password;
            this.user.confirm = response.password;
            this.user.admin = response.admin;
            this.user.active = response.active;
            this.user.hours = response.hours;
            this.user.teamId = response.teamId;

            this.notifyObservers(this.user);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public getUsersByTeam(teamId: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      if (this.user.admin) {
        this.http.get<User[]>(`${API_URL}User/GetByTeam/${teamId}`, { headers: headers })
          .subscribe(
            (response: User[]) => {
              this.clearUsersArray();
              response.forEach((u: User) => {
                this.users.push(u);
              });
              this.notifyObserversArray(this.users);
            },
            (error: any) => {
              console.log(JSON.stringify(error));
              this.loginService.validateToken();
            }
          );
      }
    }
  }

  public insertUser(user: User) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}User/Insert/`, user, { headers: headers })
        .subscribe(
          (response: any) => {
            if (response.id != undefined && response.id > 0) {
              this.messageService.setMessage({ text: "Usuário criado com sucesso", type: "info" });
              this.loadingService.setLoading(false);
              this.router.navigate(['home']);
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public updateUser(user: User) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.put(`${API_URL}User/Update/`, user, { headers: headers })
        .subscribe(
          (response: any) => {
            if (response != undefined) {
              this.user.id = response.id;
              this.user.name = response.name;
              this.user.email = response.email;
              this.user.password = response.password;
              this.user.confirm = response.password;
              this.user.admin = response.admin;
              this.user.active = response.active;
              this.user.hours = response.hours;
              this.user.teamId = response.teamId;

              this.notifyObservers(this.user);
              this.messageService.setMessage({ text: "Usuário atualizado com sucesso.", type: "info" });
            } else {
              this.messageService.setMessage({ text: "Não foi possível atualizar o usuário.", type: "warning" });
            }
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: "Não foi possível atualizar o usuário.", type: "error" });
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  public approveUser(user: User) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.put(`${API_URL}User/Approve/`, user, { headers: headers })
        .subscribe(
          (response: any) => {
            if (response != null) {
              if (user.active) {
                this.messageService.setMessage({ text: "Usuário aprovado com sucesso.", type: "info" });
              } else {
                this.messageService.setMessage({ text: "Usuário rejeitado com sucesso.", type: "info" });
              }
              this.getUsersToApprove();
            } else {
              this.messageService.setMessage({ text: "Não foi possível atualizar o usuário. Tente novamente.", type: "warning" });
            }
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: "Algum erro ocorreu. Não foi possível atualizar o usuário.", type: "error" });
            this.loadingService.setLoading(false);
            this.loginService.validateToken();
          }
        );
    }
  }

  public deleteUser(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.delete<boolean>(`${API_URL}User/Delete/${id}`, { headers: headers })
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.message = { text: 'Usuário apagado com sucesso', type: 'info' };
              this.messageService.setMessage(this.message);
              this.getUsers();
            } else {
              this.message = { text: 'Não é possível apagar o usuário', type: 'warning' };
              this.messageService.setMessage(this.message);
              this.loadingService.setLoading(false);
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.message = { text: 'Ocorreu erro ao tentar apagar o usuário', type: 'error' };
            this.messageService.setMessage(this.message);
            this.loginService.validateToken();
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (user: User) => void) {
    this.observers.push(observer);
  }
  public addObserverArray(observer: (users: Array<User>) => void) {
    this.observersArray.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (user: User) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public removeObserverArray(observer: (users: Array<User>) => void) {
    this.observersArray = this.observersArray.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(user: User) {
    this.observers.forEach(observer => observer(user));
  }
  private notifyObserversArray(users: Array<User>) {
    this.observersArray.forEach(observer => observer(users));
  }
}

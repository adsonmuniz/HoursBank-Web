import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Message } from '../models/message';
import { User } from '../models/user';

// Services
import { LoadingService } from './loading.service';
import { MessageService } from './message.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private authentication: Authentication | any;
  private message: Message | any;
  private observers: ((authentication: Authentication) => void)[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private router: Router
  ) {
    let ls: string | null = localStorage.getItem('authentication');
    if (ls != null && ls != "undefined") {
      this.authentication = JSON.parse(ls);
    } else {
      this.authentication = {
        authenticated: false,
        expiration: undefined,
        accessToken: "",
        message: "",
        user: undefined,
        team: undefined,
        coordinators: undefined
      }
    }

    this.message = { text: "", type: "" };
  }

  public getAuthentication() {
    return this.authentication;
  }

  public setAuthentication() {
    let ls: string | null = localStorage.getItem('authentication');
    if (ls != null && ls != "undefined") {
      this.authentication = JSON.parse(ls);
    } else {
      this.authentication = {
        authenticated: false,
        expiration: undefined,
        accessToken: "",
        message: "",
        user: undefined,
        team: undefined,
        coordinators: undefined
      }
    }
    this.notifyObservers(this.authentication);
  }

  private clearMessage() {
    this.message = { text: "", type: "" };
  }

  private httpOptions(): HttpHeaders {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return headers;
  };

  public validateToken() {
    if (this.authentication.expiration != undefined) {
      this.http.post(`${API_URL}Login/ValidateToken/`, { token: this.authentication.accessToken })
        .subscribe(
          (response: any) => {
            if (!response) {
              this.message = { text: "Chave de acesso expirada. Será necessário entrar com suas credenciais novamente!", type: "warning" };
              this.messageService.setMessage(this.message);
              this.authentication = null;
              localStorage.removeItem('authentication');
              this.notifyObservers(this.authentication);
              this.router.navigate(['']);
              this.loadingService.setLoading(false);
            } else {
              this.notifyObservers(this.authentication);
              this.router.navigate(['']);
              location.reload();
              this.loadingService.setLoading(false);
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.message = { text: "Ocorreu um erro. Será necessário entrar com suas credenciais novamente!", type: "error" };
            this.messageService.setMessage(this.message);
            this.authentication = null;
            this.notifyObservers(this.authentication);
            this.router.navigate(['']);
            this.loadingService.setLoading(false);
          }
        );
    } else {
      this.router.navigate(['']);
      this.loadingService.setLoading(false);
    }
  }

  public login(model: any) {
    this.http.post(`${API_URL}Login`, model)
      .subscribe(
        (response: any) => {

          if (response.authenticated) {
            if (response.accessToken) {
              this.authentication = response;
              this.authentication.user.confirm = this.authentication.user.password;
              localStorage.setItem('authentication', JSON.stringify(this.authentication));
              this.notifyObservers(this.authentication);
              this.router.navigate(['home']);
            } else {
              this.message = { text: "Usuário pendente de ativação!", type: "warning" };
            }
          } else {
            this.message = { text: "Email ou senha incorretos!", type: "warning" };
          }
          this.messageService.setMessage(this.message);
          this.loadingService.setLoading(false);
        },
        (error: any) => {
          // Tratar erros de requisição HTTP aqui
          if (error.status === 400 || error.status === 401) {
            this.message = { text: "Email ou senha incorretos!!", type: "warning" };
          } else {
            this.message = { text: "Ocorreu algum erro, tente novamente mais tarde!", type: "error" };
          }
          this.messageService.setMessage(this.message);
          this.loadingService.setLoading(false);
        }
      );
    this.clearMessage();
  }

  public insertUser(user: User) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}Login/Insert`, user)
        .subscribe(
          (response: any) => {
            if (response.id) {
              //this.notifyObservers(this.user);
              this.message = { text: "Usuário criado com sucesso.\nAssim que ativado, você será notificado por e-mail.", type: "info" };
              this.messageService.setMessage(this.message);
              this.loadingService.setLoading(false);
              this.router.navigate(['']);
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: "Ocorreu um erro ao tentar criar o usuário.\nTente novamente!", type: "error" });
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public checkTokenExpiration() {
    if (!this.authentication.authenticated) {
      alert('Você não está logado!')
      this.router.navigate(['']);
    }
    // Verifica se a autenticação existe e se o token expirou
    if (this.authentication && this.authentication.expiration != undefined) {
      const expirationTime = new Date(this.authentication.expiration).getTime();
      const currentTime = new Date().getTime();
      if (currentTime >= expirationTime) {
        // Se o token expirou, remove a autenticação do local storage e atualiza a tela
        localStorage.removeItem('authentication');
        this.authentication = { expiration: undefined };
        this.notifyObservers(this.authentication);
        alert('Sessão expirada, insira suas credenciais novamente!');
        this.router.navigate(['']);
      }
    }
    this.loadingService.setLoading(false);
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (authentication: Authentication) => void) {
    this.observers.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (authentication: Authentication) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(authentication: Authentication) {
    this.observers.forEach(observer => observer(authentication));
  }
}

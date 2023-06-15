import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

// Constants
import { API_URL } from './../constants';

// Models
import { Authentication } from '../models/authentication';
import { Bank } from '../models/bank';

// Services
import { LoadingService } from './loading.service';
import { LoginService } from './login.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class BankService implements OnInit {
  private authentication: Authentication | any;
  private bank: Bank | any;
  private banks: Array<Bank> = [];
  private observers: ((bank: Bank) => void)[] = [];
  private observersArray: ((banks: Array<Bank>) => void)[] = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.bank = { id: 0, start: new Date(), end: new Date(), approved: false, userId: 0, typeId: 0, description: '' }
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

  public getBanks() {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Bank/`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.banks = response;

            this.notifyObserversArray(this.banks);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
          }
        );
    }
  }

  public getBank(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Bank/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.bank = response;
            this.notifyObservers(this.bank);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public getBanksByCoordinator(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.get(`${API_URL}Bank/GetByCoordinator/${id}`, { headers: headers })
        .subscribe(
          (response: any) => {
            this.banks = response;
            this.notifyObserversArray(this.banks);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
          }
        );
    }
  }

  public filterBanks(bank: Bank) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}Bank/Filter/`, bank, { headers: headers })
        .subscribe(
          (response: any) => {
            this.banks = response;

            this.notifyObserversArray(this.banks);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public insertBank(bank: Bank) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.post(`${API_URL}Bank/Insert/`, bank, { headers: headers })
        .subscribe(
          (response: any) => {
            if (response.id) {
              this.messageService.setMessage({ text: "Registro inserido com sucesso!", type: "info" });
              this.router.navigate(['home']);
            } else {
              this.messageService.setMessage({ text: "Não foi possível inserir o registro, tente novamente!", type: "warning" });
              this.loadingService.setLoading(false);
            }

            //this.notifyObservers(this.bank);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: "Aconteceu algum erro, contate o administrador do sistema!", type: "error" });
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public updateBank(bank: Bank) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.put(`${API_URL}Bank/Update/`, bank, { headers: headers })
        .subscribe(
          (response: any) => {
            this.bank = response;
            this.notifyObservers(this.bank);
            if (bank.approved) {
              this.messageService.setMessage({ text: "Horas aprovadas com sucesso", type: "info" });
            } else {
              this.messageService.setMessage({ text: "Horas rejeitadas com sucesso", type: "info" });
            }
            this.router.navigate(['bank/approvals']);
            this.loadingService.setLoading(false);
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.loginService.validateToken();
            this.loadingService.setLoading(false);
          }
        );
    }
  }

  public deleteBank(id: number) {
    var headers = this.httpOptions();
    if (headers != undefined) {
      this.http.delete<boolean>(`${API_URL}Bank/Delete/${id}`, { headers: headers })
        .subscribe(
          (response: boolean) => {
            if (response) {
              this.messageService.setMessage({ text: 'Lançamento apagado com sucesso', type: 'info' });
            } else {
              this.messageService.setMessage({ text: 'Não foi possível apagar o lançamento', type: 'warning' });
            }
          },
          (error: any) => {
            console.log(JSON.stringify(error));
            this.messageService.setMessage({ text: 'Ocorreu erro ao tentar apagar o lançamento', type: 'error' });
          }
        );
    }
  }

  // Função para adicionar um observador ao serviço
  public addObserver(observer: (bank: Bank) => void) {
    this.observers.push(observer);
  }
  public addObserverArray(observer: (banks: Array<Bank>) => void) {
    this.observersArray.push(observer);
  }

  // Função para remover um observador do serviço
  public removeObserver(observer: (bank: Bank) => void) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  public removeObserverArray(observer: (banks: Array<Bank>) => void) {
    this.observersArray = this.observersArray.filter(obs => obs !== observer);
  }

  // Função para notificar todos os observadores quando a propriedade authentication for atualizada
  private notifyObservers(bank: Bank) {
    this.observers.forEach(observer => observer(bank));
  }
  private notifyObserversArray(banks: Array<Bank>) {
    this.observersArray.forEach(observer => observer(banks));
  }
}

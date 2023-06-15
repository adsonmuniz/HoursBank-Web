import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Authentication } from './models/authentication';

// Services
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app-component.scss']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'Banco de Horas';

  public authentication: Authentication | any;
  public year: number = (new Date()).getFullYear();

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setAuthentication();

    // Adiciona um observador para atualizar a propriedade authentication no componente quando ela for alterada no serviço
    this.loginService.addObserver((authentication: Authentication) => {
      this.authentication = authentication;
    });
  }

  ngOnChanges(): void {
    this.setAuthentication();
  }

  ngOnDestroy() {
    // Remove o observador quando o componente for destruído
    this.loginService.removeObserver((authentication: Authentication) => {
      this.authentication = authentication;
    });
  }

  public setAuthentication(): void {
    this.authentication = this.loginService.getAuthentication();
  }

  private doLogout() {
    localStorage.removeItem('authentication');
    this.authentication = { expiration: undefined };
    this.router.navigate(['']);
  }

  public logout() {
    // Lógica de logout aqui
    if (confirm("Deseja sair?")) {
      this.doLogout();
    }
  }
}

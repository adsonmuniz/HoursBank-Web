import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { User } from 'src/app/models/user';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private authentication: Authentication | any;
  public data: User | any;

  constructor(
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.data = { name: "", email: "", password: "", confirm: "" };
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);

    this.authentication = this.loginService.getAuthentication();

    if (this.authentication.authenticated) {
      this.messageService.setMessage({ text: "Você já está logado!", type: "warning" });
      this.router.navigate(['home']);
    }

    this.loadingService.setLoading(false);
  }

  public save() {
    this.loadingService.setLoading(true);
    if (this.validateData()) {
      this.loginService.insertUser(this.data);
    }
  }

  public cancel() {
    this.clear();
  }

  private clear() {
    this.data = { name: "", email: "", password: "", confirm: "" };
  }

  private validateData(): boolean {
    if (this.data.name.trim() && this.data.email.trim() && this.data.password.trim() && this.data.confirm.trim()) {
      if (this.data.password != this.data.confirm) {
        this.messageService.setMessage({ text: 'Os campos "Senha" e "Confirmar Senha" devem ser iguais.', type: 'warning' });
        this.data.password = this.data.confirm = '';
        this.loadingService.setLoading(false);
        return false;
      }
      return true;
    }
    this.loadingService.setLoading(false);
    return false;
  }
}

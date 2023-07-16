import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { User } from 'src/app/models/user';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private authentication: Authentication | any;
  public data: User | any;
  private passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
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

  public validateForm(user: User) {

    let valid = true;
    if (!this.emailRegex.test(user.email)) {
      this.messageService.setMessage({ text: "Insira um email com formato válido.", type: "warning" });
      valid = false;
    } else if (!this.passwordRegex.test(user.password)) {
      this.messageService.setMessage({ text: "A senha deve ter pelo menos 8 caracteres e conter letras maiúsculas, minúsculas, números e caracteres especiais.", type: "warning" });
      valid = false;
    } else if (user.password != user.confirm) {
      this.messageService.setMessage({ text: "A senha e confirmar a senha devem ser iguais.", type: "warning" });
      valid = false;
    }
    return valid;
  }

  private validateData(): boolean {
    if (this.data.name.trim() && this.data.email.trim() && this.data.password.trim() && this.data.confirm.trim()) {
      if (!this.validateForm(this.data)) {
        this.loadingService.setLoading(false);
        return false;
      }
      return true;
    }
    this.loadingService.setLoading(false);
    return false;
  }
}

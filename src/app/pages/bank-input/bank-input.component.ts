import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from 'src/app/models/authentication';

// Models
import { Bank } from 'src/app/models/bank';
import { User } from 'src/app/models/user';
import { BankService } from 'src/app/services/bank.service';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bank-input',
  templateUrl: './bank-input.component.html',
  styleUrls: ['./bank-input.component.scss']
})
export class BankInputComponent implements OnInit {
  private authentication: Authentication | any;
  private user: User | any;
  public bank: Bank | any;

  constructor(
    private bankService: BankService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.bank = { start: "", end: "", description: "", typeId: undefined, userId: undefined }
  }
  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();

    this.authentication = this.loginService.getAuthentication();
    if (this.authentication.authenticated) {
      this.user = this.authentication.user;
    }

    this.loadingService.setLoading(false);
  }

  public submit(type: number) {
    if (this.validateForm(type)) {
      let ok: boolean = false;
      if (type === 1 && confirm("Confirma a solicitação de ACRÉSCIMO de horas?")) {
        ok = true;
      }
      if (type === 2 && confirm("Confirma a solicitação de DESCONTO de horas?")) {
        ok = true;
      }
      if (ok) {
        this.loadingService.setLoading(true);
        this.bank.typeId = type;
        this.bank.userId = this.user.id;

        this.bankService.insertBank(this.bank);
      }
    }
  }

  public cancel() {
    this.loadingService.setLoading(true);
    this.router.navigate(['home']);
  }

  private validateForm(type: number) {
    this.messageService.clearMessage();
    let valid = true;
    if (!this.bank.start) {
      this.messageService.setMessage({ text: "Insira um início com formato válido.", type: "warning" });
      document.getElementById('start')?.focus();
      valid = false;
    } else if (!this.bank.end) {
      this.messageService.setMessage({ text: "Insira um fim com formato válido.", type: "warning" });
      document.getElementById('end')?.focus();
      valid = false;
    } else if (!this.bank.description) {
      this.messageService.setMessage({ text: "A descrição é obrigatória.", type: "warning" });
      document.getElementById('description')?.focus();
      valid = false;
    } else if (this.bank.start >= this.bank.end) {
      this.messageService.setMessage({ text: "Insira um período válido.", type: "warning" });
      document.getElementById('start')?.focus();
      valid = false;
    } else if (new Date(this.bank.start).getTime() > Date.now()) {
      this.messageService.setMessage({ text: "Não é possível inserir data futura.", type: "warning" });
      document.getElementById('start')?.focus();
      valid = false;
    } else if (new Date(this.bank.end).getTime() > Date.now()) {
      this.messageService.setMessage({ text: "Não é possível inserir data futura.", type: "warning" });
      document.getElementById('end')?.focus();
      valid = false;
    } else if (type === 1 && (new Date(this.bank.end).getTime() - new Date(this.bank.start).getTime()) > 7200000) {
      this.messageService.setMessage({ text: "Pela legislação atual o máximo é 2 horas diárias.", type: "warning" });
      document.getElementById('end')?.focus();
      valid = false;
    }
    return valid;
  }

}

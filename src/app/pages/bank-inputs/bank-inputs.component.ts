import { Component, OnInit } from '@angular/core';

// Models
import { Authentication } from 'src/app/models/authentication';
import { Bank } from 'src/app/models/bank';
import { User } from 'src/app/models/user';

// Services
import { BankService } from 'src/app/services/bank.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bank-inputs',
  templateUrl: './bank-inputs.component.html',
  styleUrls: ['./bank-inputs.component.scss']
})
export class BankInputsComponent implements OnInit {
  private authentication: Authentication | any;
  private user: User | any;
  public banks: Array<Bank> = [];
  public start: Date | any;
  public end: Date | any;

  constructor(
    private bankService: BankService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.start = new Date();
    this.end = new Date();
  }
  ngOnInit(): void {
    this.loginService.checkTokenExpiration();
    this.authentication = this.loginService.getAuthentication();

    this.bankService.addObserverArray((banks: Array<Bank>) => {
      this.banks = banks;

      this.banks.forEach((bank: Bank) => {
        bank.status = bank.dateApproved == undefined ? 'Aguardando' : (bank.approved ? 'Aprovado' : 'Recusado');
      })
    })

    if (this.authentication.authenticated) {
      this.user = this.authentication.user;

      this.getBanks();
    } else {

    }

    this.loadingService.setLoading(false);

  }

  private getBanks() {
    let bank: any = { userId: this.user.id }
    this.loadingService.setLoading(true);
    this.bankService.filterBanks(bank);
  }

  public filterBanks() {
    if (this.validatedDate()) {
      this.loadingService.setLoading(true);
      let bank: any = { userId: this.user.id, start: this.start, end: this.end };
      this.bankService.filterBanks(bank);
    }
  }

  private validatedDate(): boolean {
    let valid = true;

    if (this.start === "" || !(typeof this.start === "string")) {
      this.start = undefined
    }
    if (this.end === "" || !(typeof this.end === "string")) {
      this.end = undefined
    }

    if (this.start != undefined && this.end != undefined && this.start > this.end) {
      this.messageService.setMessage({ text: "Período selecionado inválido", type: "warning" });
      return false;
    }
    return valid;
  }

}

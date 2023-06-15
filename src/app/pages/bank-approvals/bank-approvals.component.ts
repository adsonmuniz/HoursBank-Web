import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from 'src/app/models/authentication';

// Models
import { Bank } from 'src/app/models/bank';

// Services
import { BankService } from 'src/app/services/bank.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bank-approvals',
  templateUrl: './bank-approvals.component.html',
  styleUrls: ['./bank-approvals.component.scss']
})
export class BankApprovalsComponent implements OnInit {
  private authentication: Authentication | any;

  public banks: Array<Bank> = [];
  constructor(
    private bankService: BankService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.loginService.checkTokenExpiration();
    this.authentication = this.loginService.getAuthentication();

    if (!this.authentication.coordinators.length) {
      this.messageService.setMessage({ text: "Você não tem autorização para essa funcionalidade", type: "warning" });
      this.router.navigate(['']);
    }

    this.bankService.addObserverArray((banks: Array<Bank>) => {
      this.banks = banks.filter((bank: Bank) => bank.dateApproved === null);
      this.loadingService.setLoading(false);
    });

    this.getHoursToApprove();
  }

  private getHoursToApprove() {
    if (this.authentication.user.id) {
      this.loadingService.setLoading(true);
      this.bankService.getBanksByCoordinator(this.authentication.user.id);
    }
  }

}

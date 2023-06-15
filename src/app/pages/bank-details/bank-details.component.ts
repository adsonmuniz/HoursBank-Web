import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { Bank } from 'src/app/models/bank';

// Services
import { BankService } from 'src/app/services/bank.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {
  private authentication: Authentication | any;
  public bank: Bank | any;
  private id: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bankService: BankService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.bank = { start: "", end: "", description: "", userName: "", teamName: "" };
  }
  ngOnInit(): void {
    this.messageService.clearMessage();
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();

    this.activatedRoute.params.subscribe(
      res => this.id = res['id']
    );

    this.bankService.addObserver((bank: Bank) => {
      this.bank = bank;
      if (bank.dateApproved) {
        this.messageService.setMessage({ text: "Esse lançamento já foi processado", type: "warning" });
        this.router.navigate(["bank/approvals"]);
      }
      this.loadingService.setLoading(false);
    });

    this.getDetails();
  }

  private getDetails() {
    if (this.id > 0) {
      this.bankService.getBank(this.id);
    }
  }

  public approval(type: number) {
    if (confirm("Deseja realmente " + (type === 1 ? "aprovar " : "rejeitar ") + "as horas do colaborador?")) {
      this.loadingService.setLoading(true);
      var bank: any = { id: this.id, approved: (type === 1 ? true : false) }
      this.bankService.updateBank(bank);
    }
  }

}

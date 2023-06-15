import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { Bank } from 'src/app/models/bank';
import { Coordinator } from 'src/app/models/coordinator';
import { User } from 'src/app/models/user';

//Services 
import { BankService } from 'src/app/services/bank.service';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public authentication: Authentication | any;
  public coordinators: Array<Coordinator> | any;
  public data: User | any;
  public hours: string = "0:00";
  public positive: boolean = true;
  public newUsers: number = 0;
  public usersHoursApprove: number = 0;
  public usersToApprove: Array<User> = [];

  constructor(
    private bankService: BankService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {
    this.data = { id: 0, teamId: 0, name: "", email: "", hours: 0, admin: false, active: false, password: "", confirm: "", teamName: "", firstName: "" };
  }

  ngOnInit(): void {
    this.authentication = this.loginService.checkTokenExpiration();


    if (this.data.id === 0) {
      this.authentication = this.loginService.getAuthentication();
      this.data = this.authentication.user;

      if (this.data.hours != 0) {
        const totalMinutes = this.data.hours;
        this.positive = totalMinutes >= 0 ? true : false;
        const hours = (totalMinutes / 60) | 0;
        const minutes = totalMinutes % 60;
        this.hours = (!this.positive ? "-" : "") + hours + ":" + (minutes > 10 ? minutes : "0" + minutes);
      }
      this.coordinators = this.authentication.coordinators;

      if (this.data.name.trim()) {
        this.data.firstName = ", " + this.data.name.split(' ')[0];
      }

      this.userService.addObserverArray((users: Array<User>) => {
        if (this.data.admin) {
          this.usersToApprove = users
        }
      });

      if (this.data.admin) {
        this.userService.admin();
        this.userService.getUsersToApprove();
      }

      this.bankService.addObserverArray((banks: Array<Bank>) => {
        if (this.coordinators.length > 0) {
          this.usersHoursApprove = banks.filter((bank: Bank) => bank.dateApproved === null).length;
        }
      });

      this.getHoursToApprove();
    }
  }

  public approve() {
    this.loadingService.setLoading(true);
    this.router.navigate(['user/approve']);
  }

  public bank_approvals() {
    this.loadingService.setLoading(true);
    this.router.navigate(['bank/approvals']);
  }

  public launch_hours() {
    this.loadingService.setLoading(true);
    this.router.navigate(['bank/input']);
  }

  public report() {
    this.loadingService.setLoading(true);
    this.router.navigate(['bank/inputs']);
  }

  public teams() {
    this.loadingService.setLoading(true);
    this.router.navigate(['teams']);
  }

  public users() {
    this.loadingService.setLoading(true);
    this.router.navigate(['users']);
  }

  private getHoursToApprove() {
    if (this.data.id) {
      this.loadingService.setLoading(true);
      this.bankService.getBanksByCoordinator(this.data.id);
    }
  }
}

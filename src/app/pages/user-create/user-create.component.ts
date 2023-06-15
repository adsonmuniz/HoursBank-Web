import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  private authentication: Authentication | any;
  public admin: boolean = false;
  public data: User | any;
  public teamId: number | any;
  public teams: Array<Team> = [];
  public active: boolean | any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService
  ) {
    this.data = { name: "", email: "", teamId: "", password: "", confirm: "", active: "" };
    this.teamId = "";
    this.active = "";
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();

    this.authentication = this.loginService.getAuthentication();

    if (this.authentication.authenticated) {
      this.admin = this.authentication.user.admin;
      if (!this.admin) {
        this.messageService.setMessage({ text: "Você já está logado!", type: "info" });
        this.router.navigate(['home']);
      }
    }

    this.activatedRoute.params.subscribe(
      res => console.log(res)
    );

    // Adiciona um observador para atualizar a propriedade teams no componente quando ela for alterada no serviço
    this.teamService.addObserverArray((teams: Array<Team>) => {
      this.teams = teams;

      if (this.teams.length) {
        var team = this.teams.filter(team => team.id === this.data.teamId);
        if (team.length) {
          this.data.teamName = team[0].name;
        }
      }
      this.loadingService.setLoading(false);
    });

    this.getTeams();

    this.loadingService.setLoading(false);
  }

  public save() {
    this.loadingService.setLoading(true);
    if (this.validateData()) {
      if (this.data.active == "true") {
        this.data.active = true;
      } else if (this.data.active == "false") {
        this.data.active = false;
      }
      this.userService.insertUser(this.data);
    }
  }

  public cancel() {
    this.clear();
  }

  private clear() {
    this.data = { name: "", email: "", teamId: "", password: "", confirm: "", active: "" };
  }

  private validateData(): boolean {
    if (this.data.name.trim() && this.data.email.trim() && this.data.password.trim() && this.data.confirm.trim()) {
      if (this.data.password != this.data.confirm) {
        this.messageService.setMessage({ text: 'Os campos "Senha" e "Confirmar Senha" devem ser iguais.', type: 'warning' });
        this.loadingService.setLoading(false);
        return false;
      }
      return true;
    }
    this.loadingService.setLoading(false);
    return false;
  }

  private getTeams() {
    this.teamService.getTeams();
  }
}

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
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  private authentication: Authentication | any;
  public admin: boolean = false;
  public data: User | any;
  private id: number = 0;
  public teams: Array<Team> = [];
  private passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private emailRegex: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService
  ) {
    this.data = { id: 0, teamId: 0, name: "", email: "", hours: 0, admin: false, active: false, password: "", confirm: "", teamName: "" };
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();
    this.authentication = this.loginService.getAuthentication();

    if (this.authentication != undefined) {
      this.admin = this.authentication.user.admin
    }

    this.activatedRoute.params.subscribe(
      res => this.id = res['id']
    );

    if (this.id != undefined && this.authentication.user.id != this.id) {
      if (!this.authentication.user.admin) {
        this.messageService.setMessage({ text: "Você não tem autorização para acessar essa funcionalidade!", type: "warning" });
        this.router.navigate(['home']);
      } else {
        this.userService.admin();
      }
      this.getUser(this.id);
    } else {
      this.data = this.authentication.user;
      if (this.data.active) {
        this.data.active = "true";
      } else if (this.data.active === false) {
        this.data.active = "false";
      } else {
        this.data.active = "";
      }
    }

    this.userService.addObserver((user: User) => {
      if (this.authentication.user.id != this.id) {
        this.data = user;
        if (this.data.active && this.data.active != "false") {
          this.data.active = "true";
        } else if (this.data.active === false || this.data.active === "false") {
          this.data.active = "false";
        } else {
          this.data.active = "";
        }
        if (!this.data.teamId) {
          this.data.teamId = "";
        }
        if (this.data.active == undefined) {
          this.data.active = "";
        }

      }
    });
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
  }

  public save() {
    this.loadingService.setLoading(true);
    if (this.validateForm()) {
      this.messageService.clearMessage();
      if (this.data.active === "true") {
        this.data.active = true;
      } else if (this.data.active === "false") {
        this.data.active = false;
      }
      if (this.data.teamId === "") {
        this.data.teamId = undefined;
      }

      this.userService.updateUser(this.data);
    } else {
      this.loadingService.setLoading(false);
    }
  }

  private validateForm() {
    let valid = true;
    if (!this.emailRegex.test(this.data.email)) {
      this.messageService.setMessage({ text: "Insira um email com formato válido.", type: "warning" });
      valid = false;
    } else if (!this.passwordRegex.test(this.data.password)) {
      this.messageService.setMessage({ text: "A senha deve ter pelo menos 8 caracteres e conter letras maiúsculas, minúsculas, números e caracteres especiais.", type: "warning" });
      valid = false;
    } else if (this.data.password != this.data.confirm) {
      this.messageService.setMessage({ text: "A senha e confirmar a senha devem ser iguais.", type: "warning" });
      valid = false;
    } else if (this.data.active == "true" && this.data.teamId == "") {
      this.messageService.setMessage({ text: "Para ativar o usuário deverá selecionar um time.", type: "warning" });
      valid = false;
    } else if (this.data.active != "true" && this.data.teamId != "") {
      this.messageService.setMessage({ text: "Para selecionar um time para o usuário este deverá ser ativado.", type: "warning" });
      valid = false;
    }
    return valid;
  }

  public cancel() {
    this.clear();
  }

  private clear() {
    this.data = { id: 0, type: 0, team: 0, name: "", email: "", hours: 0, admin: false, active: false, password: "", confirm: "", teamName: "", typeName: "" }
  }

  private getUser(id: number) {
    this.userService.getUserById(id);
  }

  private getTeams() {
    this.teamService.getTeams();
  }
}

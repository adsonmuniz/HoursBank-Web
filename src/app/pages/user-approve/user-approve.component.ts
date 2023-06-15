import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  selector: 'app-user-approve',
  templateUrl: './user-approve.component.html',
  styleUrls: ['./user-approve.component.scss']
})
export class UserApproveComponent implements OnInit {
  private authentication: Authentication | any;
  public teams: Array<Team> = [];
  public users: Array<User> = [];

  constructor(
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService) {

  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();
    this.authentication = this.loginService.getAuthentication();

    if (!this.authentication.user.admin) {
      this.messageService.setMessage({ text: "Você não tem autorização para acessar essa funcionalidade!", type: "warning" });
      this.router.navigate(['home']);
    }

    // Adiciona um observador para atualizar a propriedade teams no componente quando ela for alterada no serviço
    this.teamService.addObserverArray((teams: Array<Team>) => {
      this.teams = teams;
    });

    this.getTeams();

    // Adiciona um observador para atualizar a propriedade authentication no componente quando ela for alterada no serviço
    this.userService.addObserverArray((users: Array<User>) => {
      this.users = users;
    });
    this.getUsers();
  }

  public approve(id: number) {
    this.loadingService.setLoading(true);
    let teamId = this.users.filter((u: User) => u.id == id);
    if (teamId.length > 0 && teamId[0].teamId != null) {
      let user: any = { id: id, name: "exemplo", email: "exemplo@bh.com", teamId: teamId[0].teamId, active: true }
      this.userService.approveUser(user);
    } else {
      this.messageService.setMessage({ text: "Para aprovar é necessário selecionar um time", type: "warning" });
      this.loadingService.setLoading(false);
    }
  }

  public reject(id: number) {
    this.loadingService.setLoading(true);
    let user: any = { id: id, name: "exemplo", email: "exemplo@bh.com", active: false }
    this.userService.approveUser(user);
  }

  private getUsers() {
    this.loadingService.setLoading(true);
    this.userService.getUsersToApprove();
  }

  private getTeams() {
    this.loadingService.setLoading(true);
    this.teamService.getTeams();
  }

}

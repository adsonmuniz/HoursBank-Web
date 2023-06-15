import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Models
import { Authentication } from 'src/app/models/authentication';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';

//Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private authentication: Authentication | any;
  public users: Array<User> = [];
  private teams: Array<Team> = [];

  constructor(
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();
    this.authentication = this.loginService.getAuthentication();

    if (!this.authentication.user.admin) {
      this.messageService.setMessage({ text: "Você não tem autorização para acessar essa funcionalidade!", type: "warning" });
      this.router.navigate(['home']);
    }

    this.teamService.addObserverArray((teams: Array<Team>) => {
      this.teams = teams;
    });

    this.getTeams();

    this.userService.addObserverArray((users: Array<User>) => {
      this.users = users;
      this.loadingService.setLoading(true);

      this.users.forEach((u: User) => {
        if (this.teams.length > 0 && u.teamId != null) {
          const team: any = this.teams.find((t: Team) => t.id === u.teamId);
          u.teamName = team.name;
        }
      });

      this.loadingService.setLoading(false);
    });

    this.getUsers();
  }

  private getUsers() {
    this.loadingService.setLoading(true);
    this.userService.getUsers();
  }

  private getTeams() {
    this.loadingService.setLoading(true);
    this.teamService.getTeams();
  }

  public remove(id: number, nome: string) {
    if (id === 1) {
      this.messageService.setMessage({ text: "Esse usuário não pode ser excluído!", type: "warning" });
    } else if (confirm("Deseja excluir o usuário " + nome.split(" ")[0] + "?")) {
      this.loadingService.setLoading(true);
      this.userService.deleteUser(id);
    }
  }
}


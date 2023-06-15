import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from 'src/app/models/authentication';

// Models
import { Team } from 'src/app/models/team';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  private authentication: Authentication | any;
  public teams: Array<Team> = [];

  constructor(
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService
  ) { }

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
  }

  public getTeams() {
    this.loadingService.setLoading(true);
    this.teamService.getTeamsCoordinators();
  }

  public remove(teamId: number) {
    if (teamId === 1) {
      this.messageService.setMessage({ text: "Esse grupo não pode ser excluído!", type: "warning" });
    } else {
      if (confirm("Deseja realmente apagar o Time?")) {
        this.loadingService.setLoading(true);
        this.teamService.deleteTeam(teamId);
      }
    }
  }
}

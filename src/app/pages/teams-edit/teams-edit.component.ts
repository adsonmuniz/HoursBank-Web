
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Coordinator } from 'src/app/models/coordinator';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-teams-edit',
  templateUrl: './teams-edit.component.html',
  styleUrls: ['./teams-edit.component.scss']
})
export class TeamsEditComponent implements OnInit {
  private id: number = 0;
  public data: Team | any;
  public users: Array<User> | any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private messageService: MessageService,
    private router: Router,
    private teamService: TeamService,
    private userService: UserService
  ) {
    this.data = { id: 0, name: "", coordinators: [], coordinatorId: "" };
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.loginService.checkTokenExpiration();

    this.activatedRoute.params.subscribe(
      res => this.id = res['id']
    );

    this.teamService.addObserver((team: Team) => {
      this.data = team;
      if (this.data.coordinators == null) {
        this.data.coordinators = [];
      }
      this.data.coordinatorId = "";
      this.loadingService.setLoading(false);
    })

    this.getTeam();

    // Adiciona um observador para atualizar a propriedade users no componente quando ela for alterada no serviço
    this.userService.addObserverArray((users: Array<User>) => {
      this.users = users.filter(u => u.active);
      this.loadingService.setLoading(false);
    });

    this.getUsers();
  }

  public selectedCoordinator() {
    if (this.data.coordinatorId !== "") {
      const id: number = parseInt(this.data.coordinatorId);
      if (this.data.coordinators.length === 0 || !this.data.coordinators.find((c: { userId: number; }) => c.userId === id)) {
        const user: User = this.users.find((u: User) => u.id === id);
        this.data.coordinators.push({ userId: id, teamId: this.data.id, userName: user.email });
        this.data.coordinatorId = "";
      }
    }
  }

  removeCoordinator(id: number) {
    this.data.coordinators = this.data.coordinators.filter((c: Coordinator) => c.userId !== id);
  }

  private validateData(): boolean {
    if (!this.data.name.trim()) {
      this.messageService.setMessage({ text: "O campo 'Nome' é obrigatório!", type: "warning" });
      return false;
    }
    return true;
  }

  public save() {
    if (this.validateData()) {
      this.loadingService.setLoading(true);
      this.teamService.updateTeam(this.data);
    }
  }

  public cancel() {
    this.data = undefined;
    this.router.navigate(['/teams']);
  }

  private getUsers() {
    this.userService.getUsers();
  }

  private getTeam() {
    this.teamService.getTeamById(this.id);
  }
}

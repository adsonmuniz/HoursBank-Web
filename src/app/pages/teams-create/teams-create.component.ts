import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from 'src/app/models/authentication';

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
  selector: 'app-teams-create',
  templateUrl: './teams-create.component.html',
  styleUrls: ['./teams-create.component.scss']
})
export class TeamsCreateComponent implements OnInit {
  private authentication: Authentication | any;
  public data: Team | any;
  public users: Array<User> | any;

  constructor(
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

    this.authentication = this.loginService.getAuthentication();

    if (!this.authentication.user.admin) {
      this.messageService.setMessage({ text: "Você não tem autorização para acessar essa funcionalidade!", type: "warning" });
      this.router.navigate(['home']);
    }

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
        this.data.coordinators.push({ id: id, userId: user.id, username: user.email });
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
      this.teamService.insertTeam(this.data);
    }
  }

  public cancel() {
    this.data = undefined;
    this.router.navigate(['/teams']);
  }

  public getUsers() {
    this.userService.getUsers();
  }
}

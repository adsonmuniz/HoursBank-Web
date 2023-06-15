import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Login } from '../../models/login';

// Services
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public data: Login | any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {
    this.data = { email: "", password: "" };
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      res => console.log(res)
    );
    this.activatedRoute.queryParams.subscribe(
      res => console.log(res)
    )
    if (this.loginService.getAuthentication().authenticated) {
      this.router.navigate(['home']);
    }
    this.loadingService.setLoading(false);
  }

  login() {
    if (this.validade()) {
      this.loadingService.setLoading(true);
      const model = { Email: this.data.email, Password: this.data.password };

      this.loginService.login(model);
    }
  }

  private validade(): boolean {
    if (this.data && this.data.email && this.data.password) {
      return true;
    }
    return false;
  }

  public register() {
    this.loadingService.setLoading(true);
    this.router.navigate(['register']);
  }
}

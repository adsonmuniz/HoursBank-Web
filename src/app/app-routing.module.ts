import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';


//Components
import { BankApprovalsComponent } from './pages/bank-approvals/bank-approvals.component';
import { BankDetailsComponent } from './pages/bank-details/bank-details.component';
import { BankInputComponent } from './pages/bank-input/bank-input.component';
import { BankInputsComponent } from './pages/bank-inputs/bank-inputs.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { TeamsCreateComponent } from './pages/teams-create/teams-create.component';
import { TeamsEditComponent } from './pages/teams-edit/teams-edit.component';
import { UserApproveComponent } from './pages/user-approve/user-approve.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'bank/approvals', component: BankApprovalsComponent },
  { path: 'bank/details/:id', component: BankDetailsComponent },
  { path: 'bank/input', component: BankInputComponent },
  { path: 'bank/inputs', component: BankInputsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'teams/create', component: TeamsCreateComponent },
  { path: 'teams/edit/:id', component: TeamsEditComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/create', component: UserCreateComponent },
  { path: 'user/edit', component: UserEditComponent },
  { path: 'user/edit/:id', component: UserEditComponent },
  { path: 'user/approve', component: UserApproveComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MatAutocompleteModule,
    MatInputModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // importando o MatProgressSpinnerModule


// Components
import { AppComponent } from './app.component';
import { ExportButtonComponent } from './components/export-button/export-button.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ShowMessageComponent } from './components/show-message/show-message.component';
import { TitleComponent } from './components/title/title.component';

// Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserApproveComponent } from './pages/user-approve/user-approve.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { TeamsCreateComponent } from './pages/teams-create/teams-create.component';
import { TeamsEditComponent } from './pages/teams-edit/teams-edit.component';
import { UsersComponent } from './pages/users/users.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { BankInputComponent } from './pages/bank-input/bank-input.component';
import { BankInputsComponent } from './pages/bank-inputs/bank-inputs.component';
import { BankApprovalsComponent } from './pages/bank-approvals/bank-approvals.component';
import { BankDetailsComponent } from './pages/bank-details/bank-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ShowMessageComponent,
    UserApproveComponent,
    UserEditComponent,
    LoadingComponent,
    TitleComponent,
    TeamsComponent,
    TeamsCreateComponent,
    TeamsEditComponent,
    UsersComponent,
    UserCreateComponent,
    BankInputComponent,
    BankInputsComponent,
    BankApprovalsComponent,
    BankDetailsComponent,
    ExportButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

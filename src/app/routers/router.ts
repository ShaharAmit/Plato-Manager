import { Routes } from '@angular/router';
import { StockComponent } from '../content/stock/stock.component';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { WarningsComponent } from '../content/warnings/warnings.component';
import { SignUpComponent } from '../content/sign-up/sign-up.component';
import { LoginComponent } from '../content/login/login.component';

export const appRouts: Routes = [
    { path : 'stock', component: StockComponent, canActivate: [AuthGuardService]},
    { path : 'warnings', component: WarningsComponent, canActivate: [AuthGuardService]},
    { path : 'login', component: LoginComponent},
    { path : '', redirectTo: 'login', pathMatch: 'full'},
    { path : 'signUp', component: SignUpComponent}
  ];



import { Routes } from '@angular/router';
import { StockComponent } from '../content/stock/stock.component';
import { AuthGuardService } from '../services/auth-guard/auth-guard.service';
import { WarningsComponent } from '../content/warnings/warnings.component';
import { LoginComponent } from '../content/login/login.component';
import { CustomersPredComponent } from '../content/customers-pred/customers-pred.component';

export const appRouts: Routes = [
    { path : 'stock', component: StockComponent, canActivate: [AuthGuardService]},
    { path : 'warnings', component: WarningsComponent, canActivate: [AuthGuardService]},
    { path : 'customers_pred', component: CustomersPredComponent, canActivate: [AuthGuardService]},
    { path : 'login', component: LoginComponent},
    { path : '', redirectTo: 'login', pathMatch: 'full'}
  ];



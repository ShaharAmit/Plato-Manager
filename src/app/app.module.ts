import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContentComponent } from './content/content.component';
import { StockComponent } from './content/stock/stock.component';
import {Router, RouterModule, Routes, CanActivate} from '@angular/router';
import { FirebaseService } from './services/firebaseService/firebase.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { WarningsComponent } from './content/warnings/warnings.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { LoginComponent } from './content/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { appRouts } from './routers/router';
import { CustomersPredComponent } from './content/customers-pred/customers-pred.component';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ContentComponent,
    StockComponent,
    WarningsComponent,
    LoginComponent,
    CustomersPredComponent
  ],
  imports: [
    Ng2GoogleChartsModule,

    BrowserModule,
    RouterModule.forRoot(appRouts),
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
    ],
  providers: [FirebaseService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {}



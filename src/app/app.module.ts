import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ContentComponent } from './content/content.component';
import { StockComponent } from './content/stock/stock.component';
import {Router, RouterModule, Routes} from '@angular/router';
import { FirebaseService } from './services/firebaseService/firebase.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { WarningsComponent } from './content/warnings/warnings.component';


const appRouts: Routes = [
  { path : 'stock', component: StockComponent },
  { path : 'warnings', component: WarningsComponent}
] ;


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ContentComponent,
    StockComponent,
    WarningsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRouts),
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule
    ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

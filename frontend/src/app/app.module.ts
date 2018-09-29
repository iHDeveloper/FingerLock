import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterialsModule } from './materials.module';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { RegisterComponent } from './register/register.component';
import { ChangepwdComponent } from './changepwd/changepwd.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { DefaultComponent } from './default/default.component';
import { RequestDialogComponent } from './request-dialog/request-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HistoryComponent,
    RegisterComponent,
    ChangepwdComponent,
    MainComponent,
    LoginComponent,
    DefaultComponent,
    RequestDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    RequestDialogComponent
  ]
})
export class AppModule { }

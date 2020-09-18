import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import {AuthService} from './auth/auth.service';
import {TrainingService} from './training/training.service';
import {UiService} from './shared/ui.service';
import {AuthModule} from './auth/auth.module';
import {TrainingModule} from './training/training.module';
import { AngularFireModule } from 'angularfire2';
import {environment} from '../environments/environment';
import {SharedModule} from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AuthModule,
    TrainingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [AuthService, TrainingService, UiService],
  bootstrap: [AppComponent]
})
export class AppModule { }

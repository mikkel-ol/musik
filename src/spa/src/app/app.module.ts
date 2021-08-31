import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzInputModule } from 'ng-zorro-antd/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DiscordButtonComponent } from './shared/discord-button/discord-button.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    DiscordButtonComponent,
    HomeComponent,
    LoginComponent,
    CallbackComponent
  ],
  imports: [
    NzInputModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

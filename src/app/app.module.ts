import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserLoginRegisterModule } from './public/pages/user-login-register/user-login-register.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginFormModule } from './public/components/login-form/login-form.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginFormModule,
    UserLoginRegisterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ComponentsModule } from "src/app/components/components.module";





@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Initialize Firebase
    provideAnalytics(() => getAnalytics()), provideAuth(() => getAuth()), 
    
  ],  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }],
  bootstrap: [AppComponent],
})
export class AppModule {}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './shared/menu/menu.component';
import { GeneradorGrantsService } from './services/bbdd/generador-grants/generador-grants.service';
import { HomeModule } from './modulos/home/home.module';
import { BBDDModule } from './modulos/bbdd/bbdd.module';
import { PortapapelesComponent } from './shared/portapapeles/portapapeles.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    PortapapelesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BBDDModule,
    HomeModule
  ],
  providers: [GeneradorGrantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './shared/componentes/menu/menu.component';
import { GeneradorGrantsService } from './services/bbdd/generador-grants/generador-grants.service';
import { HomeModule } from './modulos/home/home.module';
import { BBDDModule } from './modulos/bbdd/bbdd.module';
import { TrackersModule } from './modulos/trackers/trackers.module';
import { PortapapelesComponent } from './shared/componentes/portapapeles/portapapeles.component';

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
    HomeModule,
    TrackersModule
  ],
  providers: [GeneradorGrantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

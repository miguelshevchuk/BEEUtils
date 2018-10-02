import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { GeneradorGrantsComponent } from './componentes/generador-grants/generador-grants.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MenuComponent } from './componentes/common/menu/menu.component';
import { GeneradorGrantsService } from './services/generador-grants/generador-grants.service';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    GeneradorGrantsComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  providers: [GeneradorGrantsService],
  bootstrap: [AppComponent]
})
export class AppModule { }

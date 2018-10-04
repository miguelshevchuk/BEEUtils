import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneradorGrantsComponent } from './generador-grants/generador-grants.component';
import { BBDDRoutingModule } from './bbdd-routing.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    GeneradorGrantsComponent
  ],
  imports: [
    CommonModule,
    BBDDRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
  ]
})
export class BBDDModule{ }

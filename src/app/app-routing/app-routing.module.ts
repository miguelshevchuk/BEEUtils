import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GeneradorGrantsComponent } from '../componentes/generador-grants/generador-grants.component';

const routes: Routes = [
  { path: 'grants', component: GeneradorGrantsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }

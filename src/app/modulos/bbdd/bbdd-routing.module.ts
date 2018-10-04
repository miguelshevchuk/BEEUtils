import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneradorGrantsComponent } from './componentes/generador-grants/generador-grants.component';

const routes: Routes = [
  { path: 'grants', component: GeneradorGrantsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class BBDDRoutingModule { }

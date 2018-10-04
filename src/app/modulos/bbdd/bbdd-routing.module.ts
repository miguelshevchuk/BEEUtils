import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneradorGrantsComponent } from './componentes/generador-grants/generador-grants.component';
import { PortapapelesComponent } from '../../shared/portapapeles/portapapeles.component';

const routes: Routes = [
  { path: 'grants', component: GeneradorGrantsComponent,
  children: [
    { path: 'resultadoGrants/:contenido', component: PortapapelesComponent}
  ]},
  
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

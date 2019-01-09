import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneradorGrantsComponent } from './generador-grants/generador-grants.component';
import { GeneradorScriptsComponent } from './generador-scripts/generador-scripts.component';
import { PortapapelesComponent } from '../../shared/componentes/portapapeles/portapapeles.component';

const routes: Routes = [
  { path: 'grants', component: GeneradorGrantsComponent,
  children: [
    { path: 'resultadoGrants/:contenido', component: PortapapelesComponent}
  ]},
  { path: 'scripts', component: GeneradorScriptsComponent,
  children: [
    { path: 'resultadoScripts/:contenido', component: PortapapelesComponent}
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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortapapelesComponent } from './shared/portapapeles/portapapeles.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }

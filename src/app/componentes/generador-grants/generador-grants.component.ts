import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Tabla} from "../../interfaces/tabla";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GeneradorGrantsService} from '../../services/generador-grants/generador-grants.service';
import {ClipboardJS} from 'clipboard/dist/clipboard.js';

@Component({
  templateUrl: './generador-grants.component.html',
  styleUrls: ['./generador-grants.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneradorGrantsComponent implements OnInit {

  esquemas:string[] = ["USR_BEE", "USR_BEE_LOG", "USR_LINK"];
  tiposDeTablas:string[]= ["Configuracion", "Transaccional", "Dominio"];
  mostrarResultado:Boolean = false;
  grants:string;

  grantForm = new FormGroup({
    esquema: new FormControl(this.esquemas[0]),
    nombreTabla: new FormControl(null, [Validators.required]),
    tipoTabla: new FormControl(this.tiposDeTablas[0]),
    aplicacion: new FormControl(true),
    batch: new FormControl(false),
  });

  get nombreTabla(){return this.grantForm.get("nombreTabla")};

  constructor(private _generadorGrantsService:GeneradorGrantsService) {
    
  }

  ngOnInit() {
  }

  activarResultado(activar){
    this.mostrarResultado = activar;
  }

  generarGrants(){
    if(this.grantForm.valid){
      let tabla:Tabla = this.grantForm.value;
      this.grants = this._generadorGrantsService.generarGrants(tabla);
      this.activarResultado(true);
    }else{
      this.activarResultado(false);
    }
  }
  

}

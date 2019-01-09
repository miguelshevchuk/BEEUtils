import { Component, OnInit } from '@angular/core';
import {Tabla} from "../../../modelos/bbdd/tabla";
import {FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {GeneradorGrantsService} from '../../../services/bbdd/generador-grants/generador-grants.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Portapapeles } from '../../../modelos/shared/portapapeles';
import { Aplicaciones } from '../../../shared/constantes/bbdd/aplicaciones.const';
import { Aplicacion } from '../../../modelos/bbdd/aplicacion';

@Component({
  selector: 'app-generador-scripts',
  templateUrl: './generador-scripts.component.html',
  styleUrls: ['./generador-scripts.component.css']
})
export class GeneradorScriptsComponent implements OnInit {

  esquemas:string[] = ["USR_BEE", "USR_BEE_LOG", "USR_LINK"];

  tiposDeDatos:string[] = ["INTEGER", "VARCHAR", "VARCHAR2", "CHAR"];

  scriptForm = new FormGroup({
    esquema: new FormControl(this.esquemas[0]),
    nombreTabla: new FormControl(null, [Validators.required]),
    campos: new FormArray([ 
      this.nuevoCampo()
    ])
  });

  

  get nombreTabla(){return this.scriptForm.get("nombreTabla")};

  nombreCampo(idx){ return this.campos.at(idx).get("nombreCampo")};

  tamanio(idx){ return this.campos.at(idx).get("tamanio")};

  get campos():FormArray{return <FormArray>this.scriptForm.get("campos")};

  constructor(private _generadorGrantsService:GeneradorGrantsService, 
    private _router: Router, private activatedRoute: ActivatedRoute) {
    
  }

  ngOnInit() {
  }

  nuevoCampo(){
    return new FormGroup({
      nombreCampo: new FormControl(null, [Validators.required]),
      tipoDato: new FormControl(this.tiposDeDatos[0]),
      tamanio: new FormControl(null),
      esPK: new FormControl(false),
      esNotNull: new FormControl(null),
      esUnique: new FormControl(null)
    });
  }

  agregarNuevoCampo(){

    this.campos.push(
      this.nuevoCampo()
    );

  }

  quitarCampo(index){
    this.campos.removeAt(index);
  }

  generarGrants(){

    if(this.scriptForm.valid){
      let tabla:Tabla = this.scriptForm.value;

      let grants = this._generadorGrantsService.generarGrants(tabla);

      let contenidoPortapeles = new Portapapeles(grants, "Habemus Creates!");

      this._router.navigate(
        ['resultadoScripts', JSON.stringify(contenidoPortapeles)], 
        { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    } 
  }

}

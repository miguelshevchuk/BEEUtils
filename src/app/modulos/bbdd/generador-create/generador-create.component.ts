import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Tabla} from "../../../modelos/bbdd/tabla";
import {FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {GeneradorCreateService} from '../../../services/bbdd/generador-create/generador-create.service';
import {Router, ActivatedRoute} from '@angular/router';
import { Portapapeles } from '../../../modelos/shared/portapapeles';
import { TipoTabla } from '../../../shared/constantes/bbdd/tipoTabla.const';

@Component({
  selector: 'app-generador-create',
  templateUrl: './generador-create.component.html',
  styleUrls: ['./generador-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneradorCreateComponent implements OnInit {

  esquemas:string[] = ["USR_BEE", "USR_BEE_LOG", "USR_LINK"];

  bases: string[] = ["b2b", "b2b_transf_mult", "afip_seti", "informacionporcanales", "refresh_online"];

  tiposDeDatos:string[] = [];

  tiposDeTablas:string[] = [TipoTabla.CFG, TipoTabla.DOM, TipoTabla.LOG, TipoTabla.MAE, TipoTabla.TMP, TipoTabla.TRX];

  bbdds: string[] = ["Oracle", "SQLServer"];

  scriptForm = new FormGroup({
    motor: new FormControl(this.bbdds[0]),
    esquema: new FormControl(this.esquemas[0]),
    base: new FormControl(this.bases[0]),
    nombreTabla: new FormControl(null, [Validators.required]),
    tipoTabla: new FormControl(this.tiposDeTablas[0]),
    comentario: new FormControl(null, [Validators.required]),
    campos: new FormArray([ 
      new FormGroup({
        nombreCampo: new FormControl({value: null, disabled: true}, [Validators.required]),
        tipoDato: new FormControl(this.tiposDeDatos[0]),
        tamanio: new FormControl(null),
        esPK: new FormControl(true),
        esNotNull: new FormControl({value: true, disabled: true}),
        esUnique: new FormControl({ value: false, disabled: true }),
        comentario: new FormControl("Identificador de la tabla", [Validators.required]),
        dominio: new FormControl(null, [Validators.required])
      })
    ])
  });

  

  get nombreTabla(){return this.scriptForm.get("nombreTabla")};

  get motor() { return this.scriptForm.get("motor") };

  get comentarioTabla() { return this.scriptForm.get("comentario") };

  nombreCampo(idx){ return this.campos.at(idx).get("nombreCampo")};

  tamanio(idx){ return this.campos.at(idx).get("tamanio")};

  esPK(idx) { return this.campos.at(idx).get("esPK") };

  dominio(idx) { return this.campos.at(idx).get("dominio") };

  comentario(idx) { return this.campos.at(idx).get("comentario") };
  
  tipoDato(idx) { return this.campos.at(idx).get("tipoDato") };

  get campos():FormArray{return <FormArray>this.scriptForm.get("campos")};

  constructor(private _generadorCreateService:GeneradorCreateService, 
    private _router: Router, private activatedRoute: ActivatedRoute) {
    
  }


  ngOnInit() {
    this.cambiarTiposDeDatosPorMotor();
  }

  nuevoCampo(){
    
    return new FormGroup({
      nombreCampo: new FormControl(null, [Validators.required]),
      tipoDato: new FormControl(this.tiposDeDatos[0]),
      tamanio: new FormControl(null),
      esPK: new FormControl(false),
      esNotNull: new FormControl(false),
      esUnique: new FormControl(false),
      comentario: new FormControl(null, [Validators.required]),
      dominio: new FormControl(null, [Validators.required])
    });
  }

  nombrePK(){
    this.nombreCampo(0).setValue(this.nombreTabla.value + "_ID");
  }

  agregarNuevoCampo(){
    this.campos.push(
      this.nuevoCampo()
    );
    this.generarDominioAutomatico(this.campos.length-1);

  }

  quitarCampo(index){
    this.campos.removeAt(index);
  }


  cambiarTiposDeDatosPorMotor(){
    if(this.motor.value == "Oracle"){
      this.tiposDeDatos = ["NUMBER", "LONG", "VARCHAR2", "CHAR", "CLOB", "DATE", "TIMESTAMP"];
    }else{
      this.tiposDeDatos = ["numeric","int", "bit", "decimal", "money", "float", "date", "datetime", "char", "text"];
    }

    this.resetearValoresDeTiposDeDatos();

  }

  resetearValoresDeTiposDeDatos(){
    for (let i = 0; i < this.campos.length; i++) {
      this.tipoDato(i).setValue(this.tiposDeDatos[0]);
      this.generarDominioAutomatico(i);
    }
  }

  generarDominioAutomatico(idx){

    let nuevoDominio = "";

    this.deshabiltiarTamañoSiCorresponde(idx);

    switch(this.tipoDato(idx).value){

      case "NUMBER": case "LONG": case "decimal": case "int": case "float": case "money": case "numeric":
        nuevoDominio = "Valor numerico";
        if (this.ingresoUnTamaño(idx)){
          nuevoDominio += " hasta "+this.tamanio(idx).value+" caracteres";
        }
        break;
      case "VARCHAR2": case "CHAR": case "char": case "text":
        nuevoDominio = "Valor alfanumerico";
        if (this.ingresoUnTamaño(idx)) {
          nuevoDominio += " hasta " + this.tamanio(idx).value + " caracteres";
        }
        break;
      case "CLOB":
        nuevoDominio = "Valor alfanumerico hasta 4000 caracteres";
        break;
      case "bit":
        nuevoDominio = "1 / 0";
        break;
      case "date": case "DATE": case "datetime":
        nuevoDominio = "Fecha";
        break;
      case "timestamp":
        nuevoDominio = "Timestamp";  
        break;
    }

    this.dominio(idx).setValue(nuevoDominio);

  }

  deshabiltiarTamañoSiCorresponde(idx){
    switch (this.tipoDato(idx).value) {
      case "CLOB": case "bit": case "date": case "datetime": case "DATE": case "timestamp": case "int": case "text":
        this.tamanio(idx).disable();
        break;
      default:
        this.tamanio(idx).enable();
        break;
    }
  }

  ingresoUnTamaño(idx){
    return this.tamanio(idx).value != null;
  }

  generarCreate(){

    if(this.scriptForm.valid){
      let tabla:Tabla = new Tabla(this.scriptForm.value);

      let create = this._generadorCreateService.generarCreate(tabla);

      let contenidoPortapeles = new Portapapeles(create, "No colgues en mandar los grants a SIR...");

      this._router.navigate(
        ['resultadoCreate', JSON.stringify(contenidoPortapeles)], 
        { relativeTo: this.activatedRoute, skipLocationChange: true }
        );
    } 
  }

}

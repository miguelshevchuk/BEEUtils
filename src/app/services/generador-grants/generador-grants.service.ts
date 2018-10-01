import { Injectable } from '@angular/core';
import {Tabla} from "../../interfaces/tabla";

@Injectable()
export class GeneradorGrantsService {

  private GRANT:string = "GRANT "; 
  private ON:string = " ON "; 
  private TO:string = " TO "; 

  constructor() {
    

  }

  generarGrants(tabla:Tabla){
    let grants = this.armarGrantsGenericos(tabla);
    grants.push(this.armarGrantsParaBatch(tabla));
    grants.push(this.armarGrantsParaApp(tabla));

    return grants;
    
  }

  private armarGrantsGenericos(tabla:Tabla){
    let grants = [this.GRANT+"SELECT "+this.ON+this.definicionTabla(tabla)+this.TO+"atinc_bee;"];
    grants.push(this.GRANT+"SELECT, UPDATE, DELETE"+this.ON+this.definicionTabla(tabla)+this.TO+"rol_sr");
    
    return grants;
  }

  private armarGrantsParaBatch(tabla:Tabla){
    let grants = "";
    if(tabla.batch){
      grants = this.armarEstructuraGrant(tabla)+"ROL_BEE_B;";
    }
    return grants;
  }
  
  private armarGrantsParaApp(tabla:Tabla){
    let grants = "";
    if(tabla.aplicacion){
      grants = this.armarEstructuraGrant(tabla)+"ROL_BEE_A;";
    }
    return grants;
  }

  private definicionTabla(tabla:Tabla){
    return tabla.esquema+"."+tabla.nombreTabla;
  }

  private armarEstructuraGrant(tabla:Tabla){
    return this.GRANT+this.permisosPorTipoTabla(tabla)+this.ON+this.definicionTabla(tabla)+this.TO;
  }

  private permisosPorTipoTabla(tabla:Tabla){

    let tipoTabla = tabla.tipoTabla;

    if(tipoTabla == "Configuracion"){
      return "SELECT";
    }else if(tipoTabla == "Transaccional"){
      return  "SELECT, UPDATE, INSERT";
    
    }else if(tipoTabla == "Dominio"){
      return "SELECT";
    
    }else if(tipoTabla == "Store Procedure"){
      return "EXECUTE";
    }

    return "";
  }

}

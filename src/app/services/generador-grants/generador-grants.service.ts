import { Injectable } from '@angular/core';
import {Tabla} from "../../interfaces/tabla";

@Injectable()
export class GeneradorGrantsService {

  private GRANT:string = "GRANT "; 
  private ON:string = " ON "; 
  private TO:string = " TO "; 
  private ENTER:string = "\n"; 

  constructor() {
    

  }

  generarGrants(tabla:Tabla){
    let grants = this.armarGrantsGenericos(tabla);
    grants += this.armarGrantsParaBatch(tabla);
    grants += this.armarGrantsParaApp(tabla);

    return grants;
    
  }

  private armarGrantsGenericos(tabla:Tabla){
    let grants = this.GRANT+"SELECT "+this.ON+this.definicionTabla(tabla)+this.TO+"ROLE_ATINC_BEE;"+this.ENTER;
    grants += this.GRANT+"SELECT, UPDATE, DELETE, INSERT "+this.ON+this.definicionTabla(tabla)+this.TO+"ROLE_USR_BEE_SRN;"+this.ENTER;
    
    return grants;
  }

  private armarGrantsParaBatch(tabla:Tabla){
    let grants = "";
    if(tabla.batch){
      grants = this.armarEstructuraGrant(tabla)+"ROL_BEE_B;"+this.ENTER;
    }
    return grants;
  }
  
  private armarGrantsParaApp(tabla:Tabla){
    let grants = "";
    if(tabla.aplicacion){
      grants = this.armarEstructuraGrant(tabla)+"ROL_BEE_A;"+this.ENTER;
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

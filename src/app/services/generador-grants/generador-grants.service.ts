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
    grants += this.armarGrantsParaApp(tabla);

    return grants;
    
  }

  private armarGrantsGenericos(tabla:Tabla){
    let grants = this.GRANT+"SELECT "+this.ON+this.definicionTabla(tabla)+this.TO+"ROLE_ATINC_BEE;"+this.ENTER;
    grants += this.GRANT+"SELECT, UPDATE, DELETE, INSERT "+this.ON+this.definicionTabla(tabla)+this.TO+"ROLE_USR_BEE_SRN;"+this.ENTER;
    
    return grants;
  }

  private decidirROL(tabla:Tabla){
    let rol = "";
    if(tabla.aplicacion == "BATCH"){
      rol = "ROL_BEE_B";
    }else if(tabla.aplicacion == "BEE"){
      rol = "ROL_BEE_A";
    }else if(tabla.aplicacion == "BO"){
      rol = "ROL_BO_A";
    }
    return rol;
  }
  
  private armarGrantsParaApp(tabla:Tabla){
    let grants = this.armarEstructuraGrant(tabla)+this.decidirROL(tabla)+";"+this.ENTER;
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
    
    }else if(tipoTabla == "Consulta"){
      return "SELECT";
    
    }else if(tipoTabla == "Store Procedure"){
      return "EXECUTE";
    }

    return "";
  }

}

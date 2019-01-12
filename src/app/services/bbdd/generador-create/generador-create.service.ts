import { Injectable } from '@angular/core';
import { Tabla } from "../../../modelos/bbdd/tabla";
import { Campo } from "../../../modelos/bbdd/campo";
import { IfStmt } from '@angular/compiler';

@Injectable()
export class GeneradorCreateService {

  private ENTER: string = "\n"; 
  private TAB: string = "\t";  
  private ORDEN_CON_NN : number = 1;


  constructor() { }

  generarCreate(tabla:Tabla){
    return this.generarCreateOracle(tabla);
  }

  generarCreateOracle(tabla: Tabla){
    let constraints = "";
    let comentarios = this.generarComentarioTabla(tabla);

    let create = "CREATE TABLE "+tabla.esquema+"."+tabla.nombreTabla+"{"+this.ENTER;

      for(let i=0; i < tabla.campos.length; i++){

        if (tabla.campos[i].esPK){

          tabla.campos[i].esNotNull = true;
          tabla.campos[i].nombreCampo = tabla.nombreTabla+"_ID";

          constraints += this.generarConstraintPK(tabla, tabla.campos[i]);

        }
        
        create += this.TAB + this.generarCampo(tabla.campos[i]);


        if (i < tabla.campos.length-1){
          create += ","+this.ENTER;
        }

        if (tabla.campos[i].esNotNull){
          constraints += this.generarConstraintNN(tabla, tabla.campos[i]);
        }

        comentarios += this.generarComentarioCampo(tabla, tabla.campos[i]);

      }

    create += this.ENTER+"}" + this.ENTER +"tablespace TS_BEE_DAT;"+this.ENTER+this.ENTER;

    constraints += this.generarConstraintUQ(tabla);

    create+= constraints+this.ENTER+this.ENTER;

    create += comentarios;

    return create;
  }

  generarCampo(campo:Campo){

    let codCampo = campo.nombreCampo+this.TAB+campo.tipoDato;

    if(campo.tamanio != null){
      codCampo += "("+campo.tamanio+") ";
    }

    if(campo.esNotNull){
      codCampo += " NOT NULL"
    }


    return codCampo;

  }

  generarConstraintNN(tabla:Tabla, campo:Campo){

    let constraintLoca = "ALTER TABLE " + tabla.esquema + "." + tabla.nombreTabla+" ";

    constraintLoca += "ADD CONSTRAINT " + this.nombreConstraintNN(tabla.nombreTabla);

    constraintLoca+= " CHECK (\""+campo.nombreCampo+"\" IS NOT NULL);"+this.ENTER+this.ENTER;

    return constraintLoca;
  }

  generarConstraintUQ(tabla: Tabla) {

    let tieneUQ = false;

    let constraintLoca = "ALTER TABLE " + tabla.esquema + "." + tabla.nombreTabla + " ";

    constraintLoca += "ADD CONSTRAINT CON_" + tabla.nombreTabla +"_01_UQ ";

    constraintLoca += "UNIQUE (";

    for (let i = 0; i < tabla.campos.length; i++) {
      let campo = tabla.campos[i];
      if(campo.esUnique){
        if(tieneUQ){
          constraintLoca += ", ";
        }
        tieneUQ = true;
        constraintLoca += campo.nombreCampo;
      }
    }

    constraintLoca += ");"+this.ENTER+this.ENTER;

    if(tieneUQ){
      return constraintLoca;
    }else{
      return "";
    }

  }

  nombreConstraintNN(nombreTabla:string){
    let numeroCon = (this.ORDEN_CON_NN.toString().length < 2) ? "0" + this.ORDEN_CON_NN : this.ORDEN_CON_NN;

    let nombre = "CON_" + nombreTabla + "_" + numeroCon + "_NN";
    this.ORDEN_CON_NN++;

    return nombre;
  }

  generarConstraintPK(tabla:Tabla, campo:Campo){
    let nombreIndice = tabla.esquema + ".PK_" + tabla.nombreTabla;

    let indice = "CREATE INDEX " + nombreIndice;
    indice += " ON "+tabla.esquema+"."+tabla.nombreTabla+"("+campo.nombreCampo+")";
    indice += " TABLESPACE TS_BEE_IDX;"+this.ENTER+this.ENTER;


    let constraint = "ALTER TABLE " + tabla.esquema + "." + tabla.nombreTabla + " ";

    constraint += "ADD CONSTRAINT CON_" + tabla.nombreTabla +"_PK";

    constraint += " PRIMARY KEY (" + campo.nombreCampo + ") ";
    constraint += "USING INDEX "+nombreIndice+";"+this.ENTER+this.ENTER;

    return indice + constraint;
  }

  generarComentarioCampo(tabla: Tabla, campo: Campo){
    let comentario = "COMMENT ON COLUMN "+tabla.esquema+"."+tabla.nombreTabla+"."+campo.nombreCampo+" IS ";

    comentario += "'PCI=N;CONTIENE="+campo.comentario+";DOMINIO="+campo.dominio+".';"+this.ENTER; 

    return comentario;
  }

  generarComentarioTabla(tabla: Tabla) {

    let comentario = "COMMENT ON TABLE " + tabla.esquema + "." + tabla.nombreTabla + " IS ";

    comentario += "'TIPO=" + this.definirTipoTabla(tabla.tipoTabla)+";CONTIENE=" + tabla.comentario + ".';" + this.ENTER;

    return comentario;
  }

  definirTipoTabla(nombreTipo:string){
    switch(nombreTipo){
      case "Configuracion":
        return "CFG";
      case "Transaccional":
        return "TRX";
      case "Log":
        return "LOG";
      case "Temporales":
        return "TMP";
      case "Maestra":
        return "MAE";
      case "Dominio":
        return "DOM";
    }
  }

}

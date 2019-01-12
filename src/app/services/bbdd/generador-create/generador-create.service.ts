import { Injectable } from '@angular/core';
import { Tabla } from "../../../modelos/bbdd/tabla";
import { Campo } from "../../../modelos/bbdd/campo";
import { IfStmt } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class GeneradorCreateService {

  private ENTER: string = "\n"; 
  private TAB: string = "\t";  
  private ORDEN_CON_NN : number = 1;


  constructor() { }

  generarCreate(tabla:Tabla){
    if(tabla.motor == "Oracle"){
      return this.generarCreateOracle(tabla);
    }else{
      return this.generarCreateSQL(tabla);
    }
  }

  prepararCampoPK(campo:Campo, tabla:Tabla){
    campo.esNotNull = true;
    campo.nombreCampo = tabla.nombreTabla + "_ID";
    return campo;
  }

  generarCreateSQL(tabla: Tabla) {
    let constraintPK = this.TAB+"CONSTRAINT [PK_"+tabla.nombreTabla+"] PRIMARY KEY CLUSTERED "+this.ENTER+"("+this.ENTER;

    let comentarios = this.generarComentarioTablaSQL(tabla);

    let create = "USE ["+tabla.base+"];"+this.ENTER+this.ENTER;

    create += "GO"+this.ENTER+this.ENTER;

    create += "CREATE TABLE [dbo].[" + tabla.nombreTabla + "]{" + this.ENTER;

    for (let i = 0; i < tabla.campos.length; i++) {

      let campo = tabla.campos[i];

      if (campo.esPK) {

        campo = this.prepararCampoPK(campo, tabla);

        constraintPK += this.TAB+"["+campo.nombreCampo+"]ASC"+this.ENTER;

        constraintPK += ")" + this.ENTER+this.TAB +"WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, ";
        
        constraintPK += "IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, ";
        constraintPK += "FILLFACTOR = 90) ON [PRIMARY] "+this.ENTER;


      }

      create += this.TAB + this.generarCampoSQL(campo);
      
      create += "," + this.ENTER;

      comentarios += this.generarComentarioCampoSQL(tabla, campo);

    }

    create += constraintPK;

    create += ") ON[PRIMARY]"+this.ENTER+this.ENTER;

    create += "GO"+this.ENTER+this.ENTER;

    create += comentarios;

    return create.toUpperCase();
  }

  generarCreateOracle(tabla: Tabla){
    let constraints = "";
    let comentarios = this.generarComentarioTabla(tabla);

    let create = "CREATE TABLE "+tabla.esquema+"."+tabla.nombreTabla+"{"+this.ENTER;

      for(let i=0; i < tabla.campos.length; i++){

        let campo = tabla.campos[i];

        if (campo.esPK){

          campo = this.prepararCampoPK(campo, tabla);

          constraints += this.generarConstraintPK(tabla, campo);

        }
        
        create += this.TAB + this.generarCampo(campo);


        if (i < tabla.campos.length-1){
          create += ","+this.ENTER;
        }

        if (tabla.campos[i].esNotNull){
          constraints += this.generarConstraintNN(tabla, campo);
        }

        comentarios += this.generarComentarioCampo(tabla, campo);

      }

    create += this.ENTER+"}" + this.ENTER +"tablespace TS_BEE_DAT;"+this.ENTER+this.ENTER;

    constraints += this.generarConstraintUQ(tabla);

    create+= constraints+this.ENTER+this.ENTER;

    create += comentarios;

    return create.toUpperCase();
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

  generarCampoSQL(campo: Campo) {

    let codCampo = "["+campo.nombreCampo+"] "+ "[" + campo.tipoDato +"]";

    if (campo.tamanio != null) {
      codCampo += "(" + campo.tamanio + ") ";
    }

    if(campo.esPK){
      codCampo += " IDENTITY(1,1)";
    }

    if (campo.esNotNull) {
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

  generarComentarioCampoSQL(tabla: Tabla, campo: Campo) {

    let comentario = "EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'PCI=N;CONTIENE=";

    comentario += campo.comentario + ";DOMINIO=" + campo.dominio+";'";

    comentario += ", @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'"+tabla.nombreTabla+"'";

    comentario += ", @level2type=N'COLUMN',@level2name=N'"+campo.nombreCampo+"';"+this.ENTER;

    comentario += "GO"+this.ENTER+this.ENTER;

    return comentario;
  }

  generarComentarioTabla(tabla: Tabla) {

    let comentario = "COMMENT ON TABLE " + tabla.esquema + "." + tabla.nombreTabla + " IS ";

    comentario += "'TIPO=" + this.definirTipoTabla(tabla.tipoTabla)+";CONTIENE=" + tabla.comentario + ".';" + this.ENTER;

    return comentario;
  }

  generarComentarioTablaSQL(tabla: Tabla) {

    let comentario = "EXEC sys.sp_addextendedproperty @name=N'MS_Description', ";

    comentario += "@value=N'TIPO=" + this.definirTipoTabla(tabla.tipoTabla) + ";CONTIENE=";

    comentario += tabla.comentario + ";'";

    comentario += ", @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'" + tabla.nombreTabla + "';"+this.ENTER;

    comentario += "GO" + this.ENTER + this.ENTER;

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

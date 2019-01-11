import { Injectable } from '@angular/core';
import { Tabla } from "../../../modelos/bbdd/tabla";

@Injectable()
export class GeneradorCreateService {

  constructor() { }

  generarCreate(tabla:Tabla){

    return "CREATE";
  }


}

import {Campo} from './campo';

export class Tabla {

    public nombreTabla:string;
    public esquema:string;
    public aplicacion:string;
    public tipoTabla:string;
    public campos:Campo[];
    public comentario: string;
    public motor:string;
    public base:string;

    constructor(){}

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



//*********** Interfaces ********************
import { ApiResponsePerfilesData, Perfiles } from 'src/app/Interfaces/Data';


@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  // private apiPerfiles = 'https://localhost:44373/api/Perfiles'; 

  
  private apiPerfiles = 'http://192.168.1.21:9004/api/Perfiles';


  constructor(private http: HttpClient) {}


    async Perfiles(): Promise<Perfiles[]> {
      try {
        // Verificar si hay conexión a Internet
        if (!navigator.onLine) {
          throw new Error('No hay conexión a Internet');
        }
  
        // Realizamos la solicitud GET
        const respuesta = await this.http.get<ApiResponsePerfilesData>(this.apiPerfiles).toPromise();
  
        // Verificamos si la respuesta y los datos son válidos
        if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
          return respuesta.detalle.data;
        } else {
          throw new Error('La respuesta del servidor no es válida');
        }
      } catch (error: any) {
        console.error('Error al obtener los perfiles:', error);
        throw error; // Deja que el componente maneje el error
      }
    }



}

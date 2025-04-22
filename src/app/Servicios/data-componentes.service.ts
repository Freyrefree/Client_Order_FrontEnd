import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Regiones, ApiResponseRegiones, TiposOrden, ApiResponseTiposOrden } from '../Interfaces/Data';

@Injectable({
  providedIn: 'root'
})
export class DataComponentesService {


  public urlApiRegiones = "https://localhost:44373/api/Regiones";
  public urlApiTiposOrden = "https://localhost:44373/api/TiposOrden";


  constructor(private http: HttpClient) { }

  async getTiposOrden(): Promise<TiposOrden[]> {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }

      // Realizamos la solicitud GET
      const respuesta = await this.http.get<ApiResponseTiposOrden>(this.urlApiTiposOrden).toPromise();

      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data; // Retornamos la lista de detalles del pedido
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }

    } catch (error: any) {
      console.error('Error al obtener las regiones:', error);
      throw error; // Deja que el componente maneje el error
    }
  }

  async getRegiones(): Promise<Regiones[]> {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }

      // Realizamos la solicitud GET
      const respuesta = await this.http.get<ApiResponseRegiones>(this.urlApiRegiones).toPromise();

      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data; // Retornamos la lista de detalles del pedido
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }

    } catch (error: any) {
      console.error('Error al obtener las regiones:', error);
      throw error; // Deja que el componente maneje el error
    }
  }


  getTiposFecha(): Observable<any> {
    // Aquí retorna el JSON
    const tiposFecha = {
      "Fechas": [
        {
          "id": 0,
          "nombre": "Todos"
        },
        {
          "id": 1,
          "nombre": "Fecha de Correo (fecha recepción)"
        },
        {
          "id": 2,
          "nombre": "Fecha de Orden"
        },
        {
          "id": 3,
          "nombre": "Fecha de Entrega"
        }
      ]
    };
    return of(tiposFecha); // Usa 'of' para simular una respuesta asíncrona
  }

  getTiposEstatus(): Observable<any> {
    // Aquí retorna el JSON
    const tiposFecha = {
      "Estatus": [
        {
          "id": 2,
          "nombre": "Todos"
        },
        {
          "id": 0,
          "nombre": "Pendiente de Autorización"
        },
        {
          "id": 1,
          "nombre": "Autorizado"
        },

      ]
    };
    return of(tiposFecha); // Usa 'of' para simular una respuesta asíncrona
  }






}

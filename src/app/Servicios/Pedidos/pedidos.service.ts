import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/Config/api-urls';
import { RespuestaPedidos, Pedido, PedidoDetalle, RespuestaPedidosDetalleAPI, FiltrosDeConsultaPedidos, DatosOrdenCompra, RespuestaPedidosReporte } from 'src/app/Interfaces/Data';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) {}

  async PedidosDelMes(): Promise<Pedido[]> {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }

      // Realizamos la solicitud GET
      const respuesta = await this.http.get<RespuestaPedidos>(API_URLS.PEDIDOS_DEL_MES).toPromise();

      // Verificamos si la respuesta y los datos son válidos
      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data; // Retornamos la lista de pedidos
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }
    } catch (error: any) {
      console.error('Error al obtener los pedidos:', error);
      throw error; // Deja que el componente maneje el error
    }
  }

  async DetallePedidoPorIdPedido(idPedido: number): Promise<PedidoDetalle[]> {
    try {
      // Verificar si hay conexión a Internet
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }

      // Crear un objeto FormData y agregar idPedido
      const formData = new FormData();
      formData.append('idPedido', idPedido.toString());

      // Realizamos la solicitud POST
      const respuesta = await this.http.post<RespuestaPedidosDetalleAPI>(API_URLS.DETALLE_PEDIDO_POR_ID, formData).toPromise();

      // Verificamos si la respuesta y los datos son válidos
      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data; // Retornamos la lista de detalles del pedido
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }
    } catch (error: any) {
      console.error('Error al obtener los detalles del pedido:', error);
      throw error; // Deja que el componente maneje el error
    }
  }

  private construirFormData(filtros: FiltrosDeConsultaPedidos): FormData {
    const formData = new FormData();
  
    if (filtros.tipoFecha !== undefined && filtros.tipoFecha !== null) {
      formData.append('TipoFecha', filtros.tipoFecha.toString());
    }
  
    if (filtros.fechaInicio) {
      formData.append('FechaInicio', filtros.fechaInicio);
    }
  
    if (filtros.fechaFin) {
      formData.append('FechaFin', filtros.fechaFin);
    }
  
    if (filtros.region) {
      formData.append('Region', filtros.region);
    }
  
    if (filtros.tipoOrdenCompra) {
      formData.append('TipoOrdenCompra', filtros.tipoOrdenCompra);
    }
  
    if (filtros.estatus !== undefined && filtros.estatus !== null) {
      formData.append('Estatus', filtros.estatus.toString());
    }
  
    if (filtros.ordenCompra) {
      formData.append('OrdenCompra', filtros.ordenCompra);
    }
  
    return formData;
  }
  

  async PedidosPorFiltros(filtros: FiltrosDeConsultaPedidos): Promise<Pedido[]> {
    try {
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }
  
      const formData = this.construirFormData(filtros);
  
      const respuesta = await this.http
      .post<RespuestaPedidos>(API_URLS.PEDIDOS_POR_FILTRO, formData)
      .toPromise();
  
      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data;
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }
    } catch (error: any) {
      console.error('Error al obtener los pedidos:', error);
      throw error;
    }
  }
  

  async PedidosPorFiltrosyDetalle(filtros: FiltrosDeConsultaPedidos): Promise<DatosOrdenCompra[]> {
    try {
      if (!navigator.onLine) {
        throw new Error('No hay conexión a Internet');
      }
  
      const formData = this.construirFormData(filtros);
  
      const respuesta = await this.http
      .post<RespuestaPedidosReporte>(API_URLS.PEDIDOS_POR_FILTRO_Y_DETALLE, formData)
      .toPromise();
  
      if (respuesta && respuesta.detalle.estatus && respuesta.detalle.data) {
        return respuesta.detalle.data;
      } else {
        throw new Error('La respuesta del servidor no es válida');
      }
    } catch (error: any) {
      console.error('Error al obtener los pedidos con detalle:', error);
      throw error;
    }
  }
  
  



}
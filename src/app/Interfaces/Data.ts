//************* Interfaz para datos de USUARIOS ***********************

export interface ModulosUsuario {
  idModulo: number;
  modulo: string;
  ruta: string;
  icono: string;
}

export interface PermisosUsuario {
  claveEmpleado: string;
  nombre: string;
  perfil: string;
  modulos: ModulosUsuario[];
}

export interface ApiResponseUsuarios {
  message: string;
  detalle: {
    estatus: boolean;
    data: PermisosUsuario[];
  };
}

export interface Empleado {
  claveEmpleado: string;
  nombreCompleto: string;
  area: string;
  puesto: string;
  correo: string;
  rfc: string;
  nss: string;
}


export interface ApiResponseUsuariosData {
  message: string;
  detalle: {
    estatus: boolean;
    data: Usuarios[];
  };
}

export interface Usuarios {
  id: number;
  nombre: string | null;
  usuario: string | null;
  fechaRegistro: Date | null;
  estatus: number | null;
  perfil: string | null;
  idPerfil: number | null;
}

export interface RespuestaUsuario {
  respuesta: boolean;
  mensaje: string;
}





// ********************** Pedidos ***************************************
export interface Pedido {
  id: number;
  idCliente: number;
  fechaCorreo: string;
  fechaRegistro: string;
  usuarioRegistro: string;
  estatus: number;
  usuarioActualiza: string;
  ordenCompra: string;
  region: string;
  tipoOrdenCompra: string;
  fechaOrden: string;
  fechaEntrega: string;
  horaEntrega: string;
  elaboradoPor: string;
  totalGlobal: number;
}

export interface DetallePedidos {
  estatus: boolean;
  data: Pedido[];
}

export interface RespuestaPedidos {
  message: string;
  detalle: DetallePedidos;
}

//**************************** Reporte *********************************
export interface Partidas {
  clave: string;
  codigoBarras: string;
  descripcion: string;
  empaque: number;
  cantidad: number;
  totalCajas: number;
  totalCosto: number;
}

export interface DatosOrdenCompra {
  id: number;
  region: string;
  ordenCompra: string;
  tipoOrdenCompra: string;
  fechaOrden: string;
  fechaEntrega: string;
  horaEntrega: string;
  elaboradoPor: string;
  partidas: Partidas[];
  totalGlobal: number;
  receivedDateTime: string; // En Angular suele representarse Date como string
}

export interface DetallePedidosReporte {
  estatus: boolean;
  data: DatosOrdenCompra[];
}

export interface RespuestaPedidosReporte {
  message: string;
  detalle: DetallePedidosReporte;
}


// ********************** Detalle de Pedidos/Partidas ***************************************

export interface PedidoDetalle {
  id: number;
  idPedido: number;
  claveMaterialCliente: string;
  codigoBarrasCliente: string;
  descripcionCliente: string;
  empaqueCliente?: number; 
  cantidadCliente?: number; 
  totalCajasCliente?: number; 
  totalCostoCliente?: number; 
  observaciones?: string; 
  usuarioActualiza?: string;
}

export interface PedidoDetalleAPI {
  estatus: boolean;
  data: PedidoDetalle[];
}

export interface RespuestaPedidosDetalleAPI {
  message: string;
  detalle: PedidoDetalleAPI;
}


// ******************** Perfiles **********************
export interface ApiResponsePerfilesData {
  message: string;
  detalle: {
    estatus: boolean;
    data: Perfiles[];
  };
}

export interface Perfiles {
  id: number;
  nombre: string | null;
  estatus: number | null;
}

// **********************Data********************************

export interface Regiones {
  nombre: string;
}
export interface ApiResponseRegiones {
  message: string;
  detalle: {
    estatus: boolean;
    data: Regiones[];
  };
}


export interface TiposOrden {
  nombre: string;
}
export interface ApiResponseTiposOrden{
  message: string;
  detalle: {
    estatus: boolean;
    data: TiposOrden[];
  };
}    

// ************************ Filtros de consulta **********
export interface FiltrosDeConsultaPedidos {
  tipoFecha?: number;
  fechaInicio?: string; // o Date si usarás objetos Date directamente
  fechaFin?: string;
  region?:string;
  tipoOrdenCompra?: string;
  estatus?: number;
  ordenCompra?: string;
}

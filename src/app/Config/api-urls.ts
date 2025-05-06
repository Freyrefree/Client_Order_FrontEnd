export const API_URLS = Object.freeze({

    // Usuarios
    URL_LOGIN: 'http://192.168.1.21:9002/login',
    API_URL_EMPLEADO: 'https://g-mc.mx:8105/api/EmpleadosByClaveNomina',
    API_URL_MODULOS_POR_USUARIO: 'http://192.168.1.21:9004/api/ModulosPorUsuario',
    API_URL_USUARIOS: 'http://192.168.1.21:9004/api/Usuarios',
    API_URL_CAMBIAR_ESTATUS: 'http://192.168.1.21:9004/api/CambiarEstatusUsuario',
    API_URL_CAMBIAR_PERFIL: 'http://192.168.1.21:9004/api/CambiarPerfilUsuario',

    //Perfiles
    PERFILES:'http://192.168.1.21:9004/api/Perfiles',

    //Pedidos
    PEDIDOS_DEL_MES: 'http://192.168.1.21:9004/api/PedidosDelMes',
    DETALLE_PEDIDO_POR_ID: 'http://192.168.1.21:9004/api/DetallePedidoPorIdPedido',
    PEDIDOS_POR_FILTRO: 'http://192.168.1.21:9004/api/ConsultaPorFiltros',
    PEDIDOS_POR_FILTRO_Y_DETALLE: 'http://192.168.1.21:9004/api/ConsultaPorFiltrosyDetalle',
});
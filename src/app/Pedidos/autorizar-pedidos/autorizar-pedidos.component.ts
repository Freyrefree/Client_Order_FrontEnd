import { Component } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig  } from '@angular/material/snack-bar';

// *************   Interfaces ****************
import { PedidoDetalle } from 'src/app/Interfaces/Data';
import { Pedido } from 'src/app/Interfaces/Data';

//************* Servicios *******************/
import { PedidosService } from 'src/app/Servicios/Pedidos/pedidos.service';

//************* Librerias *******************
// import * as XLSX from 'xlsx'; // Librería para exportar a Excel
import * as XLSX from 'xlsx-js-style';


@Component({
  selector: 'app-pedidos-admin',
  templateUrl: './autorizar-pedidos.component.html',
  styleUrls: ['./autorizar-pedidos.component.css']
})
export class AutorizarPedidos {

  //************** Constructor***********

  constructor(
    private snackBar: MatSnackBar,
    private pedidosService:PedidosService,
  ) { }


  //****************** Variables ********************
  pedidos: Pedido[] = [];
  detallePedidoPartidas: PedidoDetalle[] = [];
  sumaTotalCosto: number = 0; // Variable para almacenar la suma de totalCostoCliente
  descripcionPedido: string = ''; // Variable para almacenar la descripción del pedido
  fechaEntrega: string = ''; // Variable para almacenar la fecha de entrega del pedido
  layoutValido: boolean = false;





  //****************** On Init ***********************************************

  ngOnInit(): void {
    
    this.obtenerPedidos();

  }

  // ************** Mensajes *********************

  /**
     * Muestra un mensaje de éxito en un snackbar
     * @param message Mensaje a mostrar
     */
    showSuccessMessage(message: string) {
      let config: MatSnackBarConfig = {
        duration: 3000, // Duración en milisegundos
        verticalPosition: 'top', // 'top' o 'bottom'
        horizontalPosition: 'center', // 'start' | 'center' | 'end' | 'left' | 'right'
        panelClass: ['success-snackbar'], // Clase personalizada en CSS
      };
      this.snackBar.open(message, 'Cerrar', config);
    }

    /**
     * Muestra un mensaje de error en un snackbar
     * @param message Mensaje a mostrar
     */
    showErrorMessage(message: string) {
      let config: MatSnackBarConfig = {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['error-snackbar'],
      };
      this.snackBar.open(message, 'Cerrar', config);
    }


  // ***************** Rutinas de Componente**********************************

  validarLayout() {
  this.layoutValido = this.detallePedidoPartidas.every(detalle =>
    detalle.datosSAP?.normaEmpaque?.piezasCaja !== 0 &&
    detalle.datosSAP?.normaEmpaque?.cajasTarima !== 0 &&
    detalle.datosSAP?.normaEmpaque?.piezasTarima !== 0
  );
}



  obtenerPedidos(): void {
    this.pedidosService.PedidosDelMes()
      .then(pedidos => {
        this.pedidos = pedidos;
        // console.log('Pedidos:', this.pedidos);

      })
      .catch(error => {
        console.error('Error al obtener los pedidos:', error);
        this.showErrorMessage('Error al obtener los pedidos');
      });
  }

  // Método para obtener los detalles del pedido
  async detallePedido(clavePedido: number, descripcionPedido: string, fechaEntrega:string): Promise<void> {
      // Formatear fechaEntrega para SAP (sumar un día y formato dd.mm.yyyy)
    const fecha = new Date(fechaEntrega);
    fecha.setDate(fecha.getDate() + 1);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    this.fechaEntrega = `${dia}.${mes}.${anio}`;

    // Asignar la descripción del pedido a la propiedad
    this.descripcionPedido = descripcionPedido;
    try {
      // Llamar al servicio para obtener los detalles del pedido
      this.detallePedidoPartidas = await this.pedidosService.DetallePedidoPorIdPedido(clavePedido);
      console.log('Detalles del pedido obtenidos:', this.detallePedidoPartidas);
      // Calcular la suma de totalCostoCliente
      this.calcularSumaTotalCosto();
      this.validarLayout(); // ← aquí, después de asignar los datos
    } catch (error) {
      console.error('Error al obtener los detalles del pedido:', error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  }

  // Método para calcular la suma de totalCostoCliente
  calcularSumaTotalCosto(): void {
    this.sumaTotalCosto = this.detallePedidoPartidas.reduce((sum, detalle) => {
      return sum + (detalle.totalCostoCliente || 0); // Sumar totalCostoCliente, con un valor predeterminado de 0 si es null/undefined
    }, 0);
  }

  confirmarPedido(clavePedido: number): void {
    console.log('Confirmar pedido:', clavePedido);
    // Lógica para confirmar el pedido
  }


  recibirPedidosFiltrados(pedidos: Pedido[]): void {
    this.pedidos = pedidos;
    // console.log('Pedidos actualizados desde el hijo:', this.pedidos);
    this.showSuccessMessage('Pedidos filtrados actualizados');
  }
  
  
  
  


  


  mostrarMensajeError(elementId: string, mensaje: string): void {
    const element = document.getElementById(elementId);
  
    if (element) {
      // Desplaza el scroll al elemento
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
      // Crea el mensaje de error dinámicamente
      const mensajeError = document.createElement('div');
      mensajeError.classList.add('text-danger', 'mt-2'); // Estilo de Bootstrap para mensajes de error
      mensajeError.innerText = mensaje;
  
      // Si ya existe un mensaje de error previo, evita duplicarlo
      if (!element.parentElement?.querySelector('.text-danger')) {
        element.parentElement?.appendChild(mensajeError);
      }
  
      // Remueve el mensaje después de 3 segundos
      setTimeout(() => {
        mensajeError.remove();
      }, 3000);
    }
  }



    //********************* Excel **************

layoutVA01() {
  // Validación inicial
  if (!this.detallePedidoPartidas || this.detallePedidoPartidas.length === 0) {
    console.warn('No hay partidas para exportar');
    return;
  }

  // Preparar los datos
  const data: any[] = [];

  // Definir estilo para el encabezado
  const styleHeaderPedido = {
    fill: { fgColor: { rgb: "10446B" } },
    font: { color: { rgb: "FFFFFF" }, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    }
  };

  // Crear fila de encabezado con estilo
  const headerRow = [
    { v: '', t: 's', s: styleHeaderPedido }, // A
    { v: 'Clave Material SAP 2000', t: 's', s: styleHeaderPedido }, // B
    { v: 'Cantidad', t: 's', s: styleHeaderPedido }, // C
    { v: 'UM', t: 's', s: styleHeaderPedido }, // D
    { v: '', t: 's', s: styleHeaderPedido }, // E
    { v: 'SKU 3B', t: 's', s: styleHeaderPedido }, // F
    { v: '', t: 's', s: styleHeaderPedido }, // G
    { v: '', t: 's', s: styleHeaderPedido }, // H
    { v: '', t: 's', s: styleHeaderPedido }, // I
    { v: 'D', t: 's', s: styleHeaderPedido }, // J
    { v: '1° Fecha', t: 's', s: styleHeaderPedido }, // K
    { v: 'Ce', t: 's', s: styleHeaderPedido }, // L
  ];

  data.push(headerRow);

  // Llenar los datos
  this.detallePedidoPartidas.forEach(detalle => {
    const row = [
      '', // A
      detalle.datosSAP?.claveMaterial || '', // B
      { v: ((detalle.empaqueCliente || 0)*(detalle.cantidadCliente || 0))/1000, t: 'n' },  // C
      'mil', // D
      '', // E
      detalle.claveMaterialCliente || '', // F
      '', // G
      '', // H
      '', // I
      'D', // J
      this.fechaEntrega || '', // K
      '2000', // L
    ];
    
    data.push(row);
  });

  // Crear el libro de Excel
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

  // Ajustar anchos de columnas
  const colWidths = [
    { wch: 8 }, // A
    { wch: 20 }, // B
    { wch: 20 }, // C
    { wch: 8 }, // D
    { wch: 8 }, // E
    { wch: 20 }, // F
    { wch: 8 }, // G
    { wch: 8 }, // H
    { wch: 8 }, // I
    { wch: 8 }, // J
    { wch: 8 }, // K
    { wch: 8 }, // L

  ];
  ws['!cols'] = colWidths;

  // Añadir hoja al libro
  XLSX.utils.book_append_sheet(wb, ws, 'DetallePedido');

  // Generar el archivo
  const fecha = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Pedido_ME21N_${fecha}.xlsx`);
}
  
  
  
}

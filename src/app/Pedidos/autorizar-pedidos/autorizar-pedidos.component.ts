import { Component } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig  } from '@angular/material/snack-bar';

// *************   Interfaces ****************
import { PedidoDetalle } from 'src/app/Interfaces/Data';
import { Pedido } from 'src/app/Interfaces/Data';

//************* Servicios *******************/
import { PedidosService } from 'src/app/Servicios/Pedidos/pedidos.service';


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
  async detallePedido(clavePedido: number, descripcionPedido: string): Promise<void> {
    // console.log('Consultar detalles del pedido:', clavePedido);

    // Asignar la descripción del pedido a la propiedad
    this.descripcionPedido = descripcionPedido

    try {
      // Llamar al servicio para obtener los detalles del pedido
      this.detallePedidoPartidas = await this.pedidosService.DetallePedidoPorIdPedido(clavePedido);
      console.log('Detalles del pedido obtenidos:', this.detallePedidoPartidas);
      // Calcular la suma de totalCostoCliente
      this.calcularSumaTotalCosto();
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
  
  
  
}

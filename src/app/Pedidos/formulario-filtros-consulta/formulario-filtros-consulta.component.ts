import { Component, OnInit,EventEmitter,Output  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatosOrdenCompra, FiltrosDeConsultaPedidos, Pedido, Regiones, TiposOrden } from 'src/app/Interfaces/Data';
import { DataComponentesService } from 'src/app/Servicios/data-componentes.service';
import { PedidosService } from 'src/app/Servicios/Pedidos/pedidos.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx-js-style';


@Component({
  selector: 'app-formulario-filtros-consulta',
  templateUrl: './formulario-filtros-consulta.component.html',
  styleUrls: ['./formulario-filtros-consulta.component.css']
})
export class FormularioFiltrosConsultaComponent implements OnInit {

  form!: FormGroup;
  tiposFecha: any[] = [];
  regiones:Regiones[]=[];
  tiposOrden:TiposOrden[]=[];
  tiposEstatus: any[] = [];
  @Output() pedidosEncontrados = new EventEmitter<Pedido[]>();
  pedidos: Pedido[] = []; // Aquí los almacenas internamente también
  pedidosReporte: DatosOrdenCompra[] = []; // Aquí los almacenas internamente también
  deshabilitarFechas = true;
  fechaActual: Date = new Date();
  fechaInicioMes: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
  fechaFinMes: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);
  


  


  constructor(
    private fb: FormBuilder,
    private dataComponentesService: DataComponentesService,
    private pedidoService: PedidosService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCombos();
  
    this.suscribirseACambiosFechaTipo();
    this.deshabilitarFechasSiEsNecesario();
  }

  private inicializarFormulario(): void {

  
    this.form = this.fb.group({
      fechaTipo: [''],
      fechaInicio: [this.formatoFecha(this.fechaInicioMes)],
      fechaFin: [this.formatoFecha(this.fechaFinMes)],
      region: [''],
      tipoOrden: [''],
      estatus: [''],
      ordenCompra: ['']
    }, {
      validators: this.validarRangoFechas
    });
  }
  

  private cargarCombos(): void {
    this.cargarTiposFecha();
    this.cargarRegiones();
    this.cargarTiposOrden();
    this.cargarTiposEstatus();
  }

  private suscribirseACambiosFechaTipo(): void {
    this.form.get('fechaTipo')?.valueChanges.subscribe((valor) => {
      this.deshabilitarFechas = (valor == 0);
      this.toggleFechas(this.deshabilitarFechas);
    });
  }
  
  private deshabilitarFechasSiEsNecesario(): void {
    const valor = this.form.get('fechaTipo')?.value;
    this.deshabilitarFechas = (valor == 0);
    this.toggleFechas(this.deshabilitarFechas);
  }
  
  private toggleFechas(deshabilitar: boolean): void {
    if (deshabilitar) {
      this.form.get('fechaInicio')?.disable();
      this.form.get('fechaFin')?.disable();
      this.form.get('fechaInicio')?.setValue('');
      this.form.get('fechaFin')?.setValue('');
    } else {
      this.form.get('fechaInicio')?.enable();
      this.form.get('fechaFin')?.enable();
      this.form.get('fechaInicio')?.setValue(this.formatoFecha(this.fechaInicioMes));
      this.form.get('fechaFin')?.setValue(this.formatoFecha(this.fechaFinMes));
    }
  }
  
  private formatoFecha(fecha: Date): string {
    return fecha.toISOString().substring(0, 10);
  }

  private validarRangoFechas(form: FormGroup): { [key: string]: any } | null {
    const inicio = form.get('fechaInicio')?.value;
    const fin = form.get('fechaFin')?.value;
  
    if (inicio && fin && inicio > fin) {
      return { rangoInvalido: true };
    }
  
    return null;
  }
  

  //********************* Fechas *****************************************
  cargarTiposFecha() {
    this.dataComponentesService.getTiposFecha().subscribe(data => {
      this.tiposFecha = data.Fechas;
      this.setDefaultFecha();
    });
  }

  setDefaultFecha(): void {
    if (this.tiposFecha.length > 0) {
      this.form.get('fechaTipo')?.setValue(this.tiposFecha[2].id);
    }
  }

    //********************* Estatus *****************************************
    cargarTiposEstatus() {
      this.dataComponentesService.getTiposEstatus().subscribe(data => {
        this.tiposEstatus = data.Estatus;
        this.setDefaultEstatus();
      });
    }
  
    setDefaultEstatus(): void {
      if (this.tiposEstatus.length > 0) {
        this.form.get('estatus')?.setValue(this.tiposEstatus[0].id);
      }
    }

  //********************* Regiones *****************************************
  cargarRegiones(): void {
    this.dataComponentesService.getRegiones().then((regiones) => {
      this.regiones = regiones;
    }).catch((error) => {
      console.error('Error al cargar las regiones:', error);
    });
  }
  //********************* Tipos Orden *****************************************
  cargarTiposOrden(): void {
    this.dataComponentesService.getTiposOrden().then((tiposOrden) => {
      this.tiposOrden = tiposOrden;
    }).catch((error) => {
      console.error('Error al cargar los tipos de orden:', error);
    });
  }


  buscarDatos() {
    const filtros: FiltrosDeConsultaPedidos = {
      tipoFecha: this.form.value.fechaTipo,
      fechaInicio: this.form.value.fechaInicio,
      fechaFin: this.form.value.fechaFin,
      region: this.form.value.region,
      tipoOrdenCompra: this.form.value.tipoOrden,
      estatus: this.form.value.estatus,        
      ordenCompra: this.form.value.ordenCompra
    };
  
    this.pedidoService.PedidosPorFiltros(filtros).then(pedidos => {
      console.log('Pedidos recibidos:', pedidos);
      this.pedidos = pedidos;
      this.pedidosEncontrados.emit(pedidos); // ✅ Emitimos al padre
    }).catch(error => {
      console.error('Error al buscar pedidos:', error);
    });
  }





  //********************* Excel **************

  exportarAExcel() {
    const filtros: FiltrosDeConsultaPedidos = {
      tipoFecha: this.form.value.fechaTipo,
      fechaInicio: this.form.value.fechaInicio,
      fechaFin: this.form.value.fechaFin,
      region: this.form.value.region,
      tipoOrdenCompra: this.form.value.tipoOrden,
      estatus: this.form.value.estatus,
      ordenCompra: this.form.value.ordenCompra
    };
  
    this.pedidoService.PedidosPorFiltrosyDetalle(filtros).then(pedidos => {
      this.pedidosReporte = pedidos;
  
      if (!this.pedidosReporte || this.pedidosReporte.length === 0) {
        console.warn('No hay pedidos para exportar');
        return;
      }
  
      const data: any[][] = [];
  
      const headerPedido = [
        'Región', 'Orden de Compra', 'Tipo de Orden', 'Fecha de Orden', 'Fecha de Entrega',
        'Hora de Entrega', 'Elaborado Por', 'Total Global',
      ];
  
      const headerPartida = [
        '', 'Clave ó SKU', 'Código de Barras', 'Descripción', 'Empaque',
        'Cantidad', 'Total Cajas', 'Total Costo'
      ];
  
      data.push(headerPedido);
  
      let rowIndex = 1;
  
      for (const pedido of this.pedidosReporte) {
        const filaPedido = [
          pedido.region,
          pedido.ordenCompra,
          pedido.tipoOrdenCompra,
          pedido.fechaOrden,
          pedido.fechaEntrega,
          pedido.horaEntrega,
          pedido.elaboradoPor,
          pedido.totalGlobal,
        ];
        data.push(filaPedido);
        rowIndex++;
  
        if (pedido.partidas && pedido.partidas.length > 0) {
          data.push(headerPartida);
          rowIndex++;
  
          for (const partida of pedido.partidas) {
            data.push([
              '',
              partida.clave,
              partida.codigoBarras,
              partida.descripcion,
              partida.empaque,
              partida.cantidad,
              partida.totalCajas,
              partida.totalCosto
            ]);
            rowIndex++;
          }
  
          data.push([]);
          rowIndex++;
        }
      }
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
  
      // Estilos
      const styleHeaderPedido = {
        fill: { fgColor: { rgb: "10446B" } },
        font: { color: { rgb: "FFFFFF" }, bold: true },
        alignment: { horizontal: "center", vertical: "center" }
      };
  
      const styleHeaderPartida = {
        fill: { fgColor: { rgb: "AFDA6E" } },
        font: { color: { rgb: "000000" }, bold: true },
        alignment: { horizontal: "center", vertical: "center" }
      };
  
      const ref = XLSX.utils.decode_range(worksheet['!ref']!);
  
      for (let R = ref.s.r; R <= ref.e.r; ++R) {
        const row = data[R];
        if (!row) continue;
  
        for (let C = 0; C < row.length; ++C) {
          const cell_address = { c: C, r: R };
          const cell_ref = XLSX.utils.encode_cell(cell_address);
          const cell = worksheet[cell_ref];
          if (!cell) continue;
  
          // Estilos
          if (R === 0) {
            cell.s = styleHeaderPedido;
          } else if (data[R][0] === '' && data[R][1] === 'Clave ó SKU') {
            cell.s = styleHeaderPartida;
          }
  
          // Formato moneda para Total Global y Total Costo
          if (
            (C === 7 && R > 0 && data[R][C] && typeof data[R][C] === 'number') || // Total Global
            (C === 7 && data[R][0] === '') // Total Costo en partidas
          ) {
            cell.z = '$#,##0.00';
          }
  
          // // Formato fecha/hora para ReceivedDateTime
          // if (C === 8 && R > 0 && data[R][C] instanceof Date) {
          //   cell.t = 'd';
          //   cell.z = 'dd/mm/yyyy hh:mm';
          // }
        }
      }
  
      // Ajuste automático del ancho
      worksheet['!cols'] = data[0].map((_, colIndex) => {
        const maxLength = data.reduce((max, row) => {
          const val = row[colIndex] ? row[colIndex].toString() : '';
          return Math.max(max, val.length);
        }, 10);
        return { wch: maxLength + 2 };
      });
  
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Pedidos': worksheet },
        SheetNames: ['Pedidos']
      };
  
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      const blob: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
  
      FileSaver.saveAs(blob, 'pedidos.xlsx');
    });
  }
  
  




  



  
  
}

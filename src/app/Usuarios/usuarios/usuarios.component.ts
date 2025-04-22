import { Component, OnInit } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; // Importar MatSnackBar

// Servicios  *************
import { UserService } from 'src/app/Servicios/Usuarios/user.service';
import { PerfilesService } from 'src/app/Servicios/Perfiles/perfiles.service';
//** Interfaces *********
import { Usuarios } from 'src/app/Interfaces/Data';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {

  //*************** Inicio de variables ************** 
  usuarios: Usuarios[] = [];
  perfiles: { value: number, label: string }[] = []; // Perfiles con formato para el select


  constructor(
    private usuariosService: UserService,
    private perfilesService: PerfilesService,
     private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerPerfiles();

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




  async obtenerUsuarios() {
    try {
      this.usuarios = await this.usuariosService.Usuarios();
      console.log('Usuarios obtenidos:', this.usuarios);
      this.showSuccessMessage('Usuarios cargados exitosamente');
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.showErrorMessage('Error al cargar usuarios');
    }
  }

  async obtenerPerfiles() {
    try {
      const perfilesData = await this.perfilesService.Perfiles();
      this.perfiles = perfilesData.map(perfil => ({
        value: perfil.id,
        label: perfil.nombre || 'Sin nombre' // Valor por defecto si el nombre es nulo
      }));
      console.log('Perfiles obtenidos:', this.perfiles);
      this.showSuccessMessage('Perfiles cargados exitosamente');

    } catch (error) {
      console.error('Error al cargar perfiles:', error);
      this.showErrorMessage('Error al cargar perfiles');

    }
  }


  async cambiarEstatus(usuario: Usuarios) {
    try {
      // Guardamos el estado original para poder revertir si falla
      const estadoOriginal = usuario.estatus;
      
      // Cambiamos el estado visualmente inmediatamente (feedback rápido)
      usuario.estatus = usuario.estatus === 1 ? 0 : 1;
      
      // Llamamos al servicio
      const respuesta = await this.usuariosService.CambiarEstatus(usuario.id);
      
      if (!respuesta || !respuesta.respuesta) {
        throw new Error(respuesta?.mensaje || 'Error desconocido al cambiar estatus');
      }
      
      // Si todo sale bien, mostramos mensaje
      this.showSuccessMessage('Estado actualizado correctamente');
      
    } catch (error) {
      // Revertimos el cambio visual si hay error
      usuario.estatus = usuario.estatus === 1 ? 0 : 1;
      
      console.error('Error al cambiar estado:', error);
      
      // Mostramos mensaje de error al usuario
      this.showErrorMessage(
        error instanceof Error ? error.message : 'Error al cambiar el estado'
      );
    }
  }

  cambiarPerfil(id: number, perfil: number) {
    console.log(`Usuario ID: ${id} - Nuevo Perfil: ${perfil}`);
    
    this.usuariosService.CambiarPerfil(id, perfil)
      .then((respuesta) => {
        if (respuesta.respuesta) {
          console.log('Perfil actualizado correctamente:', respuesta.mensaje);
          this.showSuccessMessage(`Perfil actualizado: ${respuesta.mensaje}`);
        } else {
          console.error('Error al actualizar el perfil:', respuesta.mensaje);
          this.showErrorMessage(`Error al actualizar el perfil: ${respuesta.mensaje}`);
        }
      })
      .catch((error) => {
        console.error('Error al cambiar el perfil:', error);
        this.showErrorMessage('Ocurrió un error al cambiar el perfil');
      });
  }
  

}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../Servicios/Usuarios/user.service';
import { ModulosUsuario, PermisosUsuario } from '../Interfaces/Data';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  isCollapsed = false;
  modulos: ModulosUsuario[] = []; // Define un arreglo para los módulos de tipo ModulosUsuario[]
  errorMessage: string = '';
  nombreUsuario: string = 'Invitado'; // Valor por defecto
  userImageSrc: string = ''; // Propiedad para la imagen aleatoria
  claveEmpleado :string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    

    // Generar la ruta de la imagen aleatoria
    this.userImageSrc = this.getRandomUserImage();

    
    // Suscribirse a los datos del empleado
    this.userService.datosEmpleado$.subscribe((data) => {
      if (data) {
        this.nombreUsuario = data.nombreCompleto; // Actualizar el nombre del usuario
        this.claveEmpleado = data.claveEmpleado;
        this.loadModulos(this.claveEmpleado); // Cargar los módulos

      } else {
        this.nombreUsuario = 'Invitado'; // Valor por defecto si no hay datos
      }
    });




  }

  async loadModulos(claveEmpleado:string) {
    try {
      // Obtenemos los módulos llamando al servicio
      const modulosResponse = await this.userService.getModulosPorUsuario(claveEmpleado);

      if (modulosResponse?.detalle?.estatus) {
        // Extraemos los módulos de cada PermisosUsuario y los asignamos a la variable modulos
        this.modulos = this.extractModulosFromPermisos(modulosResponse.detalle.data);
        console.log('Módulos obtenidos:', this.modulos);
        console.log('Empleado: ', claveEmpleado);
      } else {
        this.errorMessage = modulosResponse?.message || 'Error desconocido al obtener los módulos';
        console.error(this.errorMessage);
      }
    } catch (error) {
      this.errorMessage = 'Error al obtener los módulos: ' + (error instanceof Error ? error.message : error);
      console.error(this.errorMessage);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // Extrae los módulos de cada PermisosUsuario y los retorna como un arreglo de ModulosUsuario[]
  extractModulosFromPermisos(permisos: PermisosUsuario[]): ModulosUsuario[] {
    let modulos: ModulosUsuario[] = [];

    // Recorre cada PermisosUsuario y extrae sus modulos
    permisos.forEach((permiso) => {
      // Aquí extraemos directamente los modulos de cada PermisosUsuario
      modulos = modulos.concat(permiso.modulos);
    });

    return modulos;
  }

    // Función para generar la ruta de la imagen aleatoria
    private getRandomUserImage(): string {
      const randomUser = Math.floor(Math.random() * 5) + 1; // Número aleatorio entre 1 y 5
      return `assets/images/users/user${randomUser}.jpg`; // Ruta de la imagen
    }

  cerrarSesion(): void {
    this.userService.logout(); // Llama a la función de logout
  }
}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './Template/template.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { MatTableModule } from '@angular/material/table'; // Módulo de tablas
import { MatButtonModule } from '@angular/material/button'; // Para los botones
import { MatIconModule } from '@angular/material/icon'; // Opcional, para iconos


import { MatTreeModule } from '@angular/material/tree';

import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { SelectButtonModule } from 'primeng/selectbutton'; // Asegúrate de importar el módulo de PrimeNG correspondiente
import { TreeTableModule } from 'primeng/treetable';

//************** Componentes ********
import { AutorizarPedidos } from './Pedidos/autorizar-pedidos/autorizar-pedidos.component';
import { UsuariosComponent } from './Usuarios/usuarios/usuarios.component';
import { SelectOptionPerfilesComponent } from './Perfiles/select-option-perfiles/select-option-perfiles.component';
import { UnauthorizedComponent } from './Unauthorized/unauthorized/unauthorized.component';
import { FormularioFiltrosConsultaComponent } from './Pedidos/formulario-filtros-consulta/formulario-filtros-consulta.component';




@NgModule({
  declarations: [
    AppComponent,
    AutorizarPedidos,
    UsuariosComponent,
    TemplateComponent,
    SelectOptionPerfilesComponent,
    UnauthorizedComponent,
    FormularioFiltrosConsultaComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]), // Importa RouterModule
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,

    MatTableModule,
    MatButtonModule,
    MatIconModule, // Opcional
    MatTreeModule,


    FormsModule, // Asegurar que FormsModule esté incluido
    SelectButtonModule, // Agregar el módulo correspondiente de PrimeNG
    TreeTableModule



  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

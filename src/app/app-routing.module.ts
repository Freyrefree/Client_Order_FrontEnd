import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './Template/template.component';
import { AutorizarPedidos } from './Pedidos/autorizar-pedidos/autorizar-pedidos.component';
import { UsuariosComponent } from './Usuarios/usuarios/usuarios.component';
import { authGuard } from './Guard/auth.guard';
import { UnauthorizedComponent } from './Unauthorized/unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateComponent,
    canActivate: [authGuard],
    children: [
      { 
        path: 'pedidos',
        component: AutorizarPedidos,
        data: { requiredModule: 'pedidos' }
      },
      { 
        path: 'usuarios',
        component: UsuariosComponent,
        data: { requiredModule: 'usuarios' }
      },
      { path: '', pathMatch: 'full', redirectTo: 'pedidos' },
    ],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
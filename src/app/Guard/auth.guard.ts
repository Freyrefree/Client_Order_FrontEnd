import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../Servicios/Usuarios/user.service';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const userService = inject(UserService);
  const router = inject(Router);


  userService.obtenerYGuardarToken();

  if (!userService.isAuthenticated()) {
    userService.logout();
    return false;
  }

  // Obtener el path de manera más confiable
  let path = route.routeConfig?.path;
  
  // Si es la ruta raíz (''), obtenemos el path de la primera ruta hija
  if (path === '' && route.firstChild) {
    path = route.firstChild.routeConfig?.path;
  }

  console.log('Ruta solicitada:', path); // Para debug

  try {
    const tienePermiso = await userService.verificarPermisosRuta(path);
    
    if (!tienePermiso) {
      console.warn('Acceso no autorizado a ruta:', path);
      return router.createUrlTree(['/unauthorized']);
    }
    
    return true;
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return router.createUrlTree(['/unauthorized']);
  }
};
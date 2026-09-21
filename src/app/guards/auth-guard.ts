import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAutenticado()) {
    return true; // Permite o acesso à rota protegida
  } else {
    router.navigate(['/login']); // Redireciona para o login
    return false;
  }
};

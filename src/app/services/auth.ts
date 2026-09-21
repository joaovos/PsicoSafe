import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'psicosafe_auth_token';
  private readonly USER_KEY = 'psicosafe_user_data';

  
  cadastrar(usuario: { nome: string; email: string; crp: string; senha: string }): boolean {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
    return true;
  }

 
  login(email: string, senha: string): boolean {
    const usuarioSalvo = localStorage.getItem(this.USER_KEY);
    if (!usuarioSalvo) return false;

    const usuario = JSON.parse(usuarioSalvo);
    if (usuario.email === email && usuario.senha === senha) {
      localStorage.setItem(this.TOKEN_KEY, 'token_simulado_12345');
      return true;
    }
    return false;
  }

 
  isAutenticado(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

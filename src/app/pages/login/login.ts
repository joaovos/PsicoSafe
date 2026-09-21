import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../login/login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  isModoCadastro = false;
  mensagemErro = '';

  // Dados do Formulário
  nome = '';
  email = '';
  crp = '';
  senha = '';

  constructor(private authService: AuthService, private router: Router) {}

  alternarModo() {
    this.isModoCadastro = !this.isModoCadastro;
    this.mensagemErro = '';
  }

  onSubmit() {
    if (this.isModoCadastro) {
      if (!this.nome || !this.email || !this.crp || !this.senha) {
        this.mensagemErro = 'Preencha todos os campos do cadastro.';
        return;
      }
      this.authService.cadastrar({
        nome: this.nome,
        email: this.email,
        crp: this.crp,
        senha: this.senha
      });
      alert('Cadastro realizado com sucesso! Faça login.');
      this.alternarModo();
    } else {
      const sucesso = this.authService.login(this.email, this.senha);
      if (sucesso) {
        this.router.navigate(['/dashboard']);
      } else {
        this.mensagemErro = 'E-mail ou senha incorretos (ou cadastro inexistente).';
      }
    }
  }
}
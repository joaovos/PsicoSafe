import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CarouselComponent } from '../../components/carousel/carousel';
import { PsicoSafeValidators } from '../../validators/psicosafe-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CarouselComponent],
  templateUrl: '../login/login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  isModoCadastro = false;
  mensagemErro = '';

  authForm = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, PsicoSafeValidators.emailFormat()] }),
    crp: new FormControl('', { nonNullable: true, validators: [Validators.required, PsicoSafeValidators.crpFormat()] }),
    senha: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8), PsicoSafeValidators.noSequentialChars()] }),
    termosUso: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue })
  });

  constructor(private authService: AuthService, private router: Router) {}

  alternarModo() {
    this.isModoCadastro = !this.isModoCadastro;
    this.mensagemErro = '';
    this.authForm.reset();
  }

  onSubmit() {
    const camposObrigatorios = this.isModoCadastro 
      ? ['nome', 'email', 'crp', 'senha', 'termosUso'] 
      : ['email', 'senha'];

    camposObrigatorios.forEach((campo) => this.authForm.get(campo)?.markAsTouched());

    if (camposObrigatorios.some((campo) => this.authForm.get(campo)?.invalid)) {
      return;
    }

    const { nome, email, crp, senha } = this.authForm.getRawValue();

    if (this.isModoCadastro) {
      this.authService.cadastrar({
        nome,
        email,
        crp,
        senha
      });
      alert('Cadastro realizado com sucesso! Faça login.');
      this.alternarModo();
    } else {
      const sucesso = this.authService.login(email, senha);
      if (sucesso) {
        this.router.navigate(['/dashboard']);
      } else {
        this.mensagemErro = 'E-mail ou senha incorretos (ou cadastro inexistente).';
      }
    }
  }

  onCrpInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const crp = input.value.replace(/\D/g, '').slice(0, 7);
    const formatado = crp.length > 2 ? `${crp.slice(0, 2)}/${crp.slice(2)}` : crp;

    input.value = formatado;
    this.authForm.controls.crp.setValue(formatado);
  }
}
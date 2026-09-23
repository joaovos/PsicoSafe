import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { PsicoSafeValidators } from '../../validators/psicosafe-validators';

export interface Sessao {
  data: string;
  anotacoes: string;
}

export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  sessoes: Sessao[];
}

@Component({
  selector: 'app-prontuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './prontuario.html',
  styleUrl: './prontuario.css'
})
export class Prontuario implements OnInit {
  pacientes: Paciente[] = [];
  pacienteSelecionado: Paciente | null = null;
  filtroBusca = '';
  modoPrivacidade = false;
  exibirModalNovoPaciente = false;
  novoPacienteForm = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    telefone: new FormControl('', { nonNullable: true, validators: PsicoSafeValidators.phoneFormat() }),
    email: new FormControl('', { nonNullable: true, validators: PsicoSafeValidators.emailFormat() })
  });

  novaAnotacaoSessao = '';

  ngOnInit() {
    this.carregarPacientes();
  }

  carregarPacientes() {
    const dadosSalvos = localStorage.getItem('psicosafe_pacientes');

    if (dadosSalvos) {
      this.pacientes = JSON.parse(dadosSalvos);
    } else {
      this.pacientes = [];
      this.salvarPacientes();
    }

if (this.pacientes.length > 0) {
      this.pacienteSelecionado = this.pacientes[0];
    } else {
      this.pacienteSelecionado = null;
    }

    this.pacienteSelecionado = this.pacientes.length > 0 ? this.pacientes[0] : null;
  }

  salvarPacientes() {
    localStorage.setItem('psicosafe_pacientes', JSON.stringify(this.pacientes));
  }

  get pacientesFiltrados(): Paciente[] {
    return this.pacientes.filter(p =>
      p.nome.toLowerCase().includes(this.filtroBusca.toLowerCase())
    );
  }

  selecionarPaciente(paciente: Paciente) {
    this.pacienteSelecionado = paciente;
  }

  cadastrarPaciente() {
    this.novoPacienteForm.markAllAsTouched();
    if (this.novoPacienteForm.invalid) return;

    const { nome, telefone, email } = this.novoPacienteForm.getRawValue();

    const novo: Paciente = {
      id: Date.now(),
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim(),
      status: 'Ativo',
      sessoes: []
    };

    this.pacientes.push(novo);
    this.salvarPacientes();
    this.selecionarPaciente(novo);
    this.novoPacienteForm.reset({ nome: '', telefone: '', email: '' });
    this.exibirModalNovoPaciente = false;
  }

  onTelefoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const telefone = input.value.replace(/\D/g, '').slice(0, 11);

    input.value = telefone;
    this.novoPacienteForm.controls.telefone.setValue(telefone);
  }

  adicionarSessao() {
    if (!this.pacienteSelecionado || !this.novaAnotacaoSessao.trim()) return;

    const novaSessao: Sessao = {
      data: new Date().toISOString().split('T')[0],
      anotacoes: this.novaAnotacaoSessao
    };

    this.pacienteSelecionado.sessoes.unshift(novaSessao);
    this.salvarPacientes();
    this.novaAnotacaoSessao = '';
  }

  excluirPaciente(id: number) {
    if (confirm('Atenção (LGPD): Deseja excluir permanentemente este paciente e todo o seu histórico clínico?')) {
      this.pacientes = this.pacientes.filter(p => p.id !== id);
      this.salvarPacientes();
      this.pacienteSelecionado = this.pacientes.length > 0 ? this.pacientes[0] : null;
    }
  }

  alternarPrivacidade() {
    this.modoPrivacidade = !this.modoPrivacidade;
  }}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';
import { PsicoSafeValidators } from '../../validators/psicosafe-validators';

export interface Agendamento {
  id: number;
  pacienteNome: string;
  data: string;
  horario: string;
  modalidade: 'Presencial' | 'Online';
  status: 'Confirmado' | 'Aguardando' | 'Concluído' | 'Cancelado';
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class AgendaComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  pacientesCadastrados: string[] = [];
  dataFiltro: string = new Date().toISOString().split('T')[0];

  exibirModal = false;
  novoAgendamentoForm = new FormGroup({
    pacienteNome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    data: new FormControl(new Date().toISOString().split('T')[0], { nonNullable: true, validators: [Validators.required, PsicoSafeValidators.dateNotInPast()] }),
    horario: new FormControl('09:00', { nonNullable: true, validators: Validators.required }),
    modalidade: new FormControl<'Presencial' | 'Online'>('Presencial', { nonNullable: true, validators: Validators.required })
  });

  ngOnInit() {
    this.carregarPacientes();
    this.carregarAgendamentos();
  }

  carregarPacientes() {
    const dados = localStorage.getItem('psicosafe_pacientes');
    if (dados) {
      const lista = JSON.parse(dados);
      this.pacientesCadastrados = lista.map((p: any) => p.nome);
    }
  }

 carregarAgendamentos() {
  const dados = localStorage.getItem('psicosafe_agenda');
  if (dados) {
    this.agendamentos = JSON.parse(dados);
  } else {
    this.agendamentos = [];
    this.salvarAgendamentos();
  }
}

  salvarAgendamentos() {
    localStorage.setItem('psicosafe_agenda', JSON.stringify(this.agendamentos));
  }

  get agendamentosFiltrados(): Agendamento[] {
    return this.agendamentos
      .filter(a => a.data === this.dataFiltro)
      .sort((a, b) => a.horario.localeCompare(b.horario));
  }

  criarAgendamento() {
    this.novoAgendamentoForm.markAllAsTouched();
    if (this.novoAgendamentoForm.invalid) return;

    const { pacienteNome, data, horario, modalidade } = this.novoAgendamentoForm.getRawValue();

    const novo: Agendamento = {
      id: Date.now(),
      pacienteNome: pacienteNome.trim(),
      data,
      horario,
      modalidade,
      status: 'Aguardando'
    };

    this.agendamentos.push(novo);
    this.salvarAgendamentos();

    this.novoAgendamentoForm.reset({
      pacienteNome: '',
      data: new Date().toISOString().split('T')[0],
      horario: '09:00',
      modalidade: 'Presencial'
    });
    this.exibirModal = false;
  }

  alterarStatus(agendamento: Agendamento, novoStatus: 'Confirmado' | 'Aguardando' | 'Concluído' | 'Cancelado') {
    agendamento.status = novoStatus;
    this.salvarAgendamentos();
  }

  excluirAgendamento(id: number) {
    this.agendamentos = this.agendamentos.filter(a => a.id !== id);
    this.salvarAgendamentos();
  }
}
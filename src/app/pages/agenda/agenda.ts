import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header';

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
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class AgendaComponent implements OnInit {
  agendamentos: Agendamento[] = [];
  pacientesCadastrados: string[] = [];
  dataFiltro: string = new Date().toISOString().split('T')[0];

  exibirModal = false;
  novoPaciente = '';
  novaData = new Date().toISOString().split('T')[0];
  novoHorario = '09:00';
  novaModalidade: 'Presencial' | 'Online' = 'Presencial';

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
    if (!this.novoPaciente.trim()) return;

    const novo: Agendamento = {
      id: Date.now(),
      pacienteNome: this.novoPaciente,
      data: this.novaData,
      horario: this.novoHorario,
      modalidade: this.novaModalidade,
      status: 'Aguardando'
    };

    this.agendamentos.push(novo);
    this.salvarAgendamentos();

    this.novoPaciente = '';
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
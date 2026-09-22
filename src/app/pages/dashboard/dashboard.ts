import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  modoPrivacidade = false;

  totalConsultasHoje = 0;
  totalPacientesAtivos = 0;
  totalPendentes = 0;
  atendimentosHoje: Agendamento[] = [];

  ngOnInit() {
    this.carregarDadosGerais();
  }

  carregarDadosGerais() {
    const dataHoje = new Date().toISOString().split('T')[0];

    const dadosPacientes = localStorage.getItem('psicosafe_pacientes');
    if (dadosPacientes) {
      const pacientes = JSON.parse(dadosPacientes);
      this.totalPacientesAtivos = pacientes.filter((p: any) => p.status === 'Ativo').length;
    } else {
      this.totalPacientesAtivos = 0;
    }

    const dadosAgenda = localStorage.getItem('psicosafe_agenda');
    if (dadosAgenda) {
      const todosAgendamentos: Agendamento[] = JSON.parse(dadosAgenda);
      
      this.atendimentosHoje = todosAgendamentos
        .filter(a => a.data === dataHoje)
        .sort((a, b) => a.horario.localeCompare(b.horario));

      this.totalConsultasHoje = this.atendimentosHoje.length;
      
      this.totalPendentes = todosAgendamentos.filter(a => a.status === 'Aguardando').length;
    } else {
      this.atendimentosHoje = [];
      this.totalConsultasHoje = 0;
      this.totalPendentes = 0;
    }
  }

  alternarModoPrivacidade() {
    this.modoPrivacidade = !this.modoPrivacidade;
  }
}
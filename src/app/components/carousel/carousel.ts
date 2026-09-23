import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SlideFeature {
  icone: string;
  tag: string;
  titulo: string;
  descricao: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class CarouselComponent implements OnInit, OnDestroy {
  slides: SlideFeature[] = [
    {
      icone: '🔒',
      tag: 'Segurança',
      titulo: 'Modo Privacidade em 1 Clique',
      descricao: 'Proteja dados sensíveis borrando informações na tela instantaneamente durante seus atendimentos.'
    },
    {
      icone: '📋',
      tag: 'Gestão Clínica',
      titulo: 'Prontuário Eletrônico Estruturado',
      descricao: 'Registre evoluções clínicas com facilidade, mantendo o histórico de consultas seguro e organizado.'
    },
    {
      icone: '📅',
      tag: 'Praticidade',
      titulo: 'Agenda de Consultas Inteligente',
      descricao: 'Gerencie atendimentos presenciais e online com controle claro de status e pendências.'
    },
    {
      icone: '📊',
      tag: 'Visão Geral',
      titulo: 'Dashboard Integrado',
      descricao: 'Acompanhe a contagem de pacientes ativos e consultas do dia diretamente no painel principal.'
    }
  ];

  currentIndex = 0;
  timer: any;

  ngOnInit() {
    this.iniciarAutoplay();
  }

  ngOnDestroy() {
    this.pararAutoplay();
  }

  iniciarAutoplay() {
    this.timer = setInterval(() => {
      this.proximoSlide();
    }, 2000);
  }

  pararAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  proximoSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  irParaSlide(index: number) {
    this.currentIndex = index;
    this.pararAutoplay();
    this.iniciarAutoplay();
  }
}

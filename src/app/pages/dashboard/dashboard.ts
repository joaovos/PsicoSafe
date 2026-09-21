import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class DashboardComponent {}

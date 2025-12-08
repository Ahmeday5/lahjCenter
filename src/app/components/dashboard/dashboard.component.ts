import { Component, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  allAdvertGroupsTotal: any[] = [];
  loading: boolean = true;
  noAdvertGroupsTotalMessage: string | null = null;
  private colors: string[] = ['#D9ED92', '#83C5BE', '#EBE6F8', '#A9DEF9','#FFA69E'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.AdvertGroupsTotal();
  }

  // دالة لجلب كل اسعار الفئات)
  AdvertGroupsTotal() {
    this.loading = true;
    this.noAdvertGroupsTotalMessage = null;
    this.apiService.getAdvertGroupsTotal().subscribe({
      next: (data) => {
        this.allAdvertGroupsTotal = Array.isArray(data) ? data : [];
        if (this.allAdvertGroupsTotal.length === 0) {
          this.noAdvertGroupsTotalMessage = 'لا يوجد اسعار فئات متاحة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب كل اسعار الفئات:', error);
        this.loading = false;
      },
    });
  }

  // دالة لاختيار لون عشوائي
  getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-service',
  standalone: true,
  imports: [],
  templateUrl: './all-service.component.html',
  styleUrl: './all-service.component.scss',
})
export class AllServiceComponent {
  services: any[] = [];
  loading: boolean = true;
  noservicesMessage: string | null = null;
  servicesMessage: string | null = null;
  displayedservices: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchservices();
  }

  fetchservices() {
    this.loading = true;
    this.currentPage = 1;
    this.noservicesMessage = null;
    this.servicesMessage = null;
    this.apiService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب الخدمات:', error);
        this.noservicesMessage = 'فشل جلب الخدمات';
        this.loading = false;
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.services.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedGroups();
  }

  updateDisplayedGroups() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedservices = this.services.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedGroups();
    }
  }

  deleteServices(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة')) {
      this.loading = true;
      this.apiService.deleteServices(id).subscribe({
        next: (response) => {
          this.servicesMessage = 'تم حذف الخدمة بنجاح';
          setTimeout(() => {
            this.servicesMessage = null;
            this.fetchservices(); // إعادة جلب الفئات بعد الحذف
          }, 2000);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف الخدمة ${id}:`, error);
          this.noservicesMessage = 'فشل حذف الخدمة';
          this.loading = false;
          setTimeout(() => {
            this.noservicesMessage = null;
          }, 3000);
        },
      });
    }
  }

  editService(id: number) {
    this.router.navigate(['/edit-service', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-Governorate',
  standalone: true,
  imports: [],
  templateUrl: './all-Governorate.component.html',
  styleUrl: './all-Governorate.component.scss',
})
export class AllGovernorateComponent implements OnInit {
  governorates: any[] = [];
  loading: boolean = true;
  noGovernorateMessage: string | null = null;
  governorateMessage: string | null = null;
  displayedGovernorate: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchgovernorate();
  }

  fetchgovernorate() {
    this.loading = true;
    this.currentPage = 1;
    this.noGovernorateMessage = null;
    this.governorateMessage = null;
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => {
        this.governorates = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب المحافظات:', error);
        this.noGovernorateMessage = 'فشل جلب المحافظات';
        this.loading = false;
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.governorates.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedGroups();
  }

  updateDisplayedGroups() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedGovernorate = this.governorates.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedGroups();
    }
  }

  deleteGovernorates(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه المحافظة')) {
      this.loading = true;
      this.apiService.deleteGovernorates(id).subscribe({
        next: (response) => {
          this.governorateMessage = 'تم حذف المحافظة بنجاح';
          setTimeout(() => {
            this.governorateMessage = null;
            this.fetchgovernorate(); // إعادة جلب الفئات بعد الحذف
          }, 2000);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف المحافظة ${id}:`, error);
          this.noGovernorateMessage = 'فشل حذف المحافظة';
          this.loading = false;
          setTimeout(() => {
            this.noGovernorateMessage = null;
          }, 2000);
        },
      });
    }
  }

  editGovernorate(id: number) {
    this.router.navigate(['/edit-governorate', id]);
  }
}

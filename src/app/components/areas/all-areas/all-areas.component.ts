import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from "../../../layout/pagination/pagination.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-areas',
  standalone: true,
  imports: [PaginationComponent, FormsModule, CommonModule],
  templateUrl: './all-areas.component.html',
  styleUrl: './all-areas.component.scss'
})
export class AllAreasComponent implements OnInit {
  areas: any[] = [];
  displayedAreas: any[] = [];
  governorates: any[] = [];
  selectedGovernorateId: string = '';

  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadGovernorates();
    this.loadAllAreas(); // جلب كل المناطق في البداية
  }

  // جلب المحافظات للفلتر
  loadGovernorates(): void {
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => {
        this.governorates = data;
      },
      error: () => {
        this.errorMessage = 'فشل تحميل المحافظات';
      }
    });
  }

  // جلب كل المناطق
  loadAllAreas(): void {
    this.loading = true;
    this.apiService.getAllAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل جلب المناطق';
        this.loading = false;
      }
    });
  }

  // فلتر حسب المحافظة
  filterAreas(): void {
    this.loading = true;
    this.currentPage = 1;

    if (this.selectedGovernorateId) {
      this.apiService.getAreasByGovernorate(this.selectedGovernorateId).subscribe({
        next: (data) => {
          this.areas = data;
          this.updatePagination();
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'فشل جلب مناطق هذه المحافظة';
          this.loading = false;
        }
      });
    } else {
      this.loadAllAreas(); // رجوع لكل المناطق
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.areas.length / this.itemsPerPage);
    this.updateDisplayedAreas();
  }

  updateDisplayedAreas(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedAreas = this.areas.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedAreas();
  }

  deleteArea(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذه المنطقة؟')) {
      this.loading = true;
      this.apiService.deleteArea(id).subscribe({
        next: () => {
          this.successMessage = 'تم حذف المنطقة بنجاح';
          this.filterAreas(); // تحديث حسب الفلتر الحالي
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: () => {
          this.errorMessage = 'فشل حذف المنطقة';
          this.loading = false;
          setTimeout(() => this.errorMessage = null, 3000);
        }
      });
    }
  }

  editArea(id: number): void {
    this.router.navigate(['/edit-area', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from "../../../layout/pagination/pagination.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-subgroups',
  standalone: true,
  imports: [PaginationComponent, FormsModule, CommonModule],
  templateUrl: './all-subgroups.component.html',
  styleUrl: './all-subgroups.component.scss'
})
export class AllSubgroupsComponent implements OnInit {
  subGroups: any[] = [];
  displayedSubGroups: any[] = [];
  groups: any[] = [];
  selectedGroupId: string = '';  // فاضي = كل الفئات

  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadAllSubGroups();
  }

  loadGroups(): void {
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: () => {
        this.errorMessage = 'فشل تحميل الفئات الرئيسية';
      }
    });
  }

  loadAllSubGroups(): void {
    this.loading = true;
    this.apiService.getAllSubGroups().subscribe({
      next: (data) => {
        this.subGroups = data;
        this.updatePagination();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل جلب الفئات الفرعية';
        this.loading = false;
      }
    });
  }

  filterSubGroups(): void {
    this.loading = true;
    this.currentPage = 1;

    if (this.selectedGroupId) {
      this.apiService.getSubGroupsByGroup(+this.selectedGroupId).subscribe({
        next: (data) => {
          this.subGroups = data;
          this.updatePagination();
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'فشل جلب الفئات الفرعية لهذه الفئة';
          this.loading = false;
        }
      });
    } else {
      this.loadAllSubGroups();
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.subGroups.length / this.itemsPerPage);
    this.updateDisplayedSubGroups();
  }

  updateDisplayedSubGroups(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedSubGroups = this.subGroups.slice(start, end);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedSubGroups();
  }

  deleteSubGroup(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذه الفئة الفرعية؟')) {
      this.loading = true;
      this.apiService.deleteSubGroup(id).subscribe({
        next: () => {
          this.successMessage = 'تم حذف الفئة الفرعية بنجاح';
          this.filterSubGroups();
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: () => {
          this.errorMessage = 'فشل حذف الفئة الفرعية';
          this.loading = false;
          setTimeout(() => this.errorMessage = null, 3000);
        }
      });
    }
  }

  editSubGroup(id: number): void {
    this.router.navigate(['/edit-subGroup', id]);
  }
}

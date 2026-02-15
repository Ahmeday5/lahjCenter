import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from "../../../layout/pagination/pagination.component";

@Component({
  selector: 'app-all-group',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './all-group.component.html',
  styleUrl: './all-group.component.scss',
})
export class AllGroupComponent implements OnInit {
  groups: any[] = [];
  loading: boolean = true;
  noGroupsMessage: string | null = null;
  groupsMessage: string | null = null;
  displayedGroups: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups() {
    this.loading = true;
    this.currentPage = 1;
    this.noGroupsMessage = null;
    this.groupsMessage = null;
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب الفئات:', error);
        this.noGroupsMessage = 'فشل جلب الفئات';
        this.loading = false;
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.groups.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedGroups();
  }

  updateDisplayedGroups() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedGroups = this.groups.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedGroups();
    }
  }

  deleteGroup(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      this.loading = true;
      this.apiService.deleteGroup(id).subscribe({
        next: (response) => {
          this.groupsMessage = 'تم حذف الفئة بنجاح';
          setTimeout(() => {
            this.groupsMessage = null;
            this.fetchGroups(); // إعادة جلب الفئات بعد الحذف
          }, 2000);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف الفئة ${id}:`, error);
          this.noGroupsMessage = 'فشل حذف الفئة';
          this.loading = false;
          setTimeout(() => {
            this.noGroupsMessage = null;
          }, 3000);
        },
      });
    }
  }

  editGroup(id: number) {
    this.router.navigate(['/edit-group', id]);
  }
}

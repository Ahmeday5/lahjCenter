import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { RouterModule, Router } from '@angular/router';
import {
  Observable,
  fromEvent,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs';

@Component({
  selector: 'app-all-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-user.component.html',
  styleUrl: './all-user.component.scss',
})
export class AllUserComponent implements OnInit, AfterViewInit {
  users: any[] = [];
  loading: boolean = true;
  noUsersMessage: string | null = null;
  UsersMessage: string | null = null;
  displayedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  searchQuery: string = '';
  deleteAdId: number | null = null;
  deletionReason: string = '';

  @ViewChild('searchInput', { static: false })
  searchInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchAllUsers();
  }

  ngAfterViewInit() {
    this.setupSearchListener();
  }

  fetchAllUsers() {
    this.loading = true;
    this.noUsersMessage = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        if (this.users.length === 0) {
          this.noUsersMessage = 'لا يوجد مستخدمين متاحين';
        }
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب كل المستخدمين:', error);
        this.noUsersMessage = 'فشل جلب المستخدمين';
        this.loading = false;
      },
    });
  }

  searchUsers(query: string) {
    this.loading = true;
    this.noUsersMessage = null;
    this.currentPage = 1;
    this.searchQuery = query;

    if (!query.trim()) {
      this.fetchAllUsers();
      return;
    }

    this.apiService
      .searchMembers(query, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.users = Array.isArray(response.items) ? response.items : [];
          this.totalPages = response.totalPages || 1;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          if (this.users.length === 0) {
            this.noUsersMessage = `لا يوجد مستخدمين يحتوون على "${query}"`;
          }
          this.updateDisplayedUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في البحث عن "${query}":`, error);
          this.noUsersMessage = `فشل البحث عن "${query}"`;
          this.loading = false;
        },
      });
  }

  setupSearchListener() {
    if (this.searchInput && this.searchInput.nativeElement) {
      fromEvent(this.searchInput.nativeElement, 'input')
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          map((event: Event) => (event.target as HTMLInputElement).value)
        )
        .subscribe((query: string) => {
          this.onSearch(query);
        });
    } else {
      console.error('حقل البحث غير موجود');
    }
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.searchUsers(query);
  }

  DeactivateUser(userId: number) {
    if (
      confirm(
        'هل انت متاكد من حظر هذا المستخدم ؟ هذا الإجراء سيؤدي الي توقف ايميل المستخدم'
      )
    ) {
      this.loading = true;
      this.noUsersMessage = null;
      this.UsersMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.DeactivateDeleteRelated(userId).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.UsersMessage = 'تم حظر المستخدم بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 5 ثوانٍ
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حظر المستخدم ${userId}:`, error);
          this.noUsersMessage = `فشل حظر المستخدم ${userId}`;
          this.loading = false;
        },
      });
    }
  }

  DeleteUser(userId: number) {
    if (confirm(' انت متاكد من حذف هذا المستخدم ؟ هذا الإجراء لا يمكن التراجع عنه')) {
      this.loading = true;
      this.noUsersMessage = null;
      this.UsersMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.UsersMessage = 'تم حذف المستخدم بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 2 ثوانٍ
          this.fetchAllUsers();
        },
        error: (error) => {
          console.error(`خطأ في حذف المستخدم ${userId}:`, error);
          this.noUsersMessage = `فشل حذف المستخدم ${userId}`;
          this.loading = false;
        },
      });
    }
  }

  // دالة لإزالة رسالة النجاح بعد 2 ثوانٍ
  clearcommentsReportMessage() {
    setTimeout(() => {
      this.UsersMessage = null;
    }, 2000);
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/user-details', id]);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedUsers = this.users.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if (this.searchQuery.trim()) {
        this.searchUsers(this.searchQuery);
      } else {
        this.updateDisplayedUsers();
      }
    }
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}

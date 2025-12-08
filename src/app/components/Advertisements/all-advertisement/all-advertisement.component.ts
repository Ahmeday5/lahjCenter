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
  selector: 'app-all-advertisement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-advertisement.component.html',
  styleUrls: ['./all-advertisement.component.scss'],
})
export class AllAdvertisementComponent implements OnInit, AfterViewInit {
  groups: any[] = [];
  loading: boolean = true;
  advertisements: any[] = [];
  selectedGroup: number | null = null;
  selectedStatus: string | null = null;
  noadvertisementMessage: string | null = null;
  advertisementMessage: string | null = null;
  displayedAdvertisement: any[] = [];
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
    this.fetchGroups();
    this.fetchAllAdvertisement();
  }

  ngAfterViewInit() {
    this.setupSearchListener();
  }

  // دالة مساعدة لجلب اسم الفئة
  getGroupName(groupId: number | null): string {
    if (!groupId) return '';
    const group = this.groups.find((g) => g.id === groupId);
    return group ? group.arName : `فئة ${groupId}`;
  }

  fetchGroups() {
    this.loading = true;
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب الفئات:', error);
        this.noadvertisementMessage = 'فشل جلب الفئات';
        this.loading = false;
      },
    });
  }

  fetchAllAdvertisement() {
    this.loading = true;
    this.noadvertisementMessage = null;
    this.selectedGroup = null;
    this.selectedStatus = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.apiService.getAllAdvertisement().subscribe({
      next: (data) => {
        this.advertisements = Array.isArray(data) ? data : [];
        if (this.advertisements.length === 0) {
          this.noadvertisementMessage = 'لا يوجد إعلانات متاحة';
        }
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب كل الإعلانات:', error);
        this.noadvertisementMessage = 'فشل جلب الإعلانات';
        this.loading = false;
      },
    });
  }

  fetchAdvertisementByGroup(groupId: number) {
    this.loading = true;
    this.noadvertisementMessage = null;
    this.selectedGroup = groupId;
    this.selectedStatus = null;
    this.searchQuery = '';
    this.currentPage = 1;
    this.apiService.getAdvertisementByGroupId(groupId).subscribe({
      next: (data) => {
        this.advertisements = data;
        if (this.advertisements.length === 0) {
          this.noadvertisementMessage = `لا يوجد إعلانات في هذه فئة: ${this.getGroupName(
            groupId
          )}`;
        }
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error(
          `خطأ في جلب الإعلانات للفئة ${this.getGroupName(groupId)}:`,
          error
        );
        this.noadvertisementMessage = `فشل جلب الإعلانات للفئة ${this.getGroupName(
          groupId
        )}`;
        this.updatePagination();
        this.loading = false;
      },
    });
  }

  searchAdvertisement(query: string) {
    this.loading = true;
    this.noadvertisementMessage = null;
    this.currentPage = 1;
    this.searchQuery = query;

    if (!query.trim()) {
      if (this.selectedGroup) {
        this.fetchAdvertisementByGroup(this.selectedGroup);
      } else {
        this.fetchAllAdvertisement();
      }
      return;
    }

    this.apiService.searchByAdvertisementName(query).subscribe({
      next: (data) => {
        this.advertisements = data;
        if (this.selectedGroup) {
          this.advertisements = this.advertisements.filter(
            (advertisement) => advertisement.groupId === this.selectedGroup
          );
        }
        if (this.selectedStatus) {
          this.advertisements = this.advertisements.filter(
            (advertisement) => advertisement.status === this.selectedStatus
          );
        }
        if (this.advertisements.length === 0) {
          this.noadvertisementMessage = `لا يوجد إعلانات تحتوي على "${query}"${
            this.selectedGroup
              ? ` في فئة ${this.getGroupName(this.selectedGroup)}`
              : ''
          }${this.selectedStatus ? ` بحالة ${this.selectedStatus}` : ''}`;
        }
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في البحث عن "${query}":`, error);
        this.noadvertisementMessage = `فشل البحث عن "${query}"`;
        this.loading = false;
      },
    });
  }

  onStatusFilterClick(status: string | null) {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.searchQuery = '';
    if (status === null) {
      if (this.selectedGroup) {
        this.fetchAdvertisementByGroup(this.selectedGroup);
      } else {
        this.fetchAllAdvertisement();
      }
    } else {
      this.loading = true;
      this.noadvertisementMessage = null;
      this.apiService.getAllAdvertisement().subscribe({
        next: (data) => {
          this.advertisements = data.filter(
            (advertisement: any) => advertisement.status === status
          );
          if (this.selectedGroup) {
            this.advertisements = this.advertisements.filter(
              (advertisement: any) =>
                advertisement.groupId === this.selectedGroup
            );
          }
          if (this.advertisements.length === 0) {
            this.noadvertisementMessage = `لا يوجد إعلانات بحالة ${status}${
              this.selectedGroup
                ? ` في فئة ${this.getGroupName(this.selectedGroup)}`
                : ''
            }`;
          }
          this.updatePagination();
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في جلب الإعلانات بحالة ${status}:`, error);
          this.noadvertisementMessage = `فشل جلب الإعلانات بحالة ${status}`;
          this.loading = false;
        },
      });
    }
  }

  onFilterClick(groupId: number | null) {
    this.selectedStatus = null;
    if (groupId === null) {
      this.fetchAllAdvertisement();
    } else {
      this.fetchAdvertisementByGroup(groupId);
    }
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/advertisement-details', id]);
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.advertisements.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedAdvertisement();
  }

  updateDisplayedAdvertisement() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedAdvertisement = this.advertisements.slice(
      startIndex,
      endIndex
    );
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedAdvertisement();
    }
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
    this.searchAdvertisement(query);
  }

  // دالة لإزالة رسالة النجاح بعد 3 ثوانٍ
  clearAdvertisementMessage() {
    setTimeout(() => {
      this.advertisementMessage = null;
    }, 3000);
  }

  approveAdvertisement(id: number) {
    this.loading = true;
    this.noadvertisementMessage = null;
    this.advertisementMessage = null; // إعادة تعيين رسالة النجاح
    this.apiService.approveAdvertisement(id).subscribe({
      next: (response) => {
        console.log(response); // "Advertisement Approved Successfully"
        this.advertisementMessage = 'تم قبول الإعلان بنجاح';
        const ad = this.advertisements.find((ad) => ad.id === id);
        if (ad) {
          ad.status = 'Approved';
        }
        // تأخير تطبيق الفلاتر وعرض رسالة "لا يوجد إعلانات" بعد اختفاء رسالة النجاح
        setTimeout(() => {
          this.advertisementMessage = null; // إخفاء رسالة النجاح
          this.applyFilters(); // تطبيق الفلاتر لتحديث القائمة
          this.loading = false;
        }, 2000); // تأخير 2 ثانية
      },
      error: (error) => {
        console.error(`خطأ في قبول الإعلان ${id}:`, error);
        this.noadvertisementMessage = `فشل قبول الإعلان ${id}`;
        this.loading = false;
      },
    });
  }

  restoreAdvertisement(id: number) {
    this.loading = true;
    this.noadvertisementMessage = null;
    this.advertisementMessage = null; // إعادة تعيين رسالة النجاح
    this.apiService.restoreAdvertisement(id).subscribe({
      next: (response) => {
        console.log(response); // "Advertisement Restored Successfully"
        this.advertisementMessage = 'تم استرجاع الإعلان بنجاح';
        const ad = this.advertisements.find((ad) => ad.id === id);
        if (ad) {
          ad.status = 'New';
        }
        setTimeout(() => {
          this.advertisementMessage = null; // إخفاء رسالة النجاح
          this.applyFilters(); // تطبيق الفلاتر لتحديث القائمة
          this.loading = false;
        }, 2000);
      },
      error: (error) => {
        console.error(`خطأ في استرجاع الإعلان ${id}:`, error);
        this.noadvertisementMessage = `فشل استرجاع الإعلان ${id}`;
        this.loading = false;
      },
    });
  }

  openDeleteModal(id: number) {
    this.deleteAdId = id;
    this.deletionReason = '';
    const modal = new (window as any).bootstrap.Modal(
      document.getElementById('deleteModal')
    );
    modal.show();
  }

  deleteAdvertisement() {
    if (!this.deleteAdId || !this.deletionReason.trim()) {
      this.noadvertisementMessage = 'يرجى إدخال سبب الحذف';
      return;
    }
    if (
      confirm('هل أنت متأكد من حذف الاعلان ؟ هذا الإجراء لا يمكن التراجع عنه!')
    ) {
      this.loading = true;
      this.noadvertisementMessage = null;
      this.advertisementMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService
        .deleteAdvertisement(this.deleteAdId, this.deletionReason)
        .subscribe({
          next: (response) => {
            this.advertisementMessage = 'تم حذف الإعلان بنجاح';
            const ad = this.advertisements.find(
              (ad) => ad.id === this.deleteAdId
            );
            if (ad) {
              ad.status = 'Deleted';
            }
            this.applyFilters();
            const modal = (window as any).bootstrap.Modal.getInstance(
              document.getElementById('deleteModal')
            );
            modal.hide();
            this.deleteAdId = null;
            this.deletionReason = '';
            this.clearAdvertisementMessage(); // إزالة الرسالة بعد 5 ثوانٍ
            this.loading = false;
          },
          error: (error) => {
            console.error(`خطأ في حذف الإعلان ${this.deleteAdId}:`, error);
            this.noadvertisementMessage = `فشل حذف الإعلان ${this.deleteAdId}`;
            this.loading = false;
          },
        });
    }
  }

  applyFilters() {
    let filteredAds = [...this.advertisements];
    if (this.selectedStatus) {
      filteredAds = filteredAds.filter(
        (ad) => ad.status === this.selectedStatus
      );
    }
    if (this.selectedGroup) {
      filteredAds = filteredAds.filter(
        (ad) => ad.groupId === this.selectedGroup
      );
    }
    if (this.searchQuery.trim()) {
      filteredAds = filteredAds.filter((ad) =>
        ad.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.advertisements = filteredAds;
    if (this.advertisements.length === 0) {
      this.noadvertisementMessage = `لا يوجد إعلانات${
        this.selectedStatus ? ` بحالة ${this.selectedStatus}` : ''
      }${
        this.selectedGroup
          ? ` في فئة ${this.getGroupName(this.selectedGroup)}`
          : ''
      }${this.searchQuery ? ` تحتوي على "${this.searchQuery}"` : ''}`;
    }
    this.updatePagination();
  }
}

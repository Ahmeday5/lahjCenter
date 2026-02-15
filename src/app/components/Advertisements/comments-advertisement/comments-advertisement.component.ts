import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { PaginationComponent } from "../../../layout/pagination/pagination.component";

@Component({
  selector: 'app-comments-advertisement',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './comments-advertisement.component.html',
  styleUrls: ['./comments-advertisement.component.scss'],
})
export class CommentsAdvertisementComponent implements OnInit {
  loading: boolean = true;
  comments: any[] = [];
  nocommentsMessage: string | null = null;
  commentsMessage: string | null = null;
  displayedComments: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  advertId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // استرجاع advertId من المسار
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.advertId = +id;
      this.fetchAdvertisementComment(this.advertId, this.currentPage, this.itemsPerPage);
    } else {
      this.nocommentsMessage = 'لم يتم العثور على معرف الإعلان';
      this.loading = false;
    }
  }

  fetchAdvertisementComment(advertId: number, page: number, pageSize: number) {
    this.loading = true;
    this.nocommentsMessage = null;
    this.commentsMessage = null;

    this.apiService.getCommentAdvertisement(advertId, page, pageSize).subscribe({
      next: (data) => {
        // ترتيب التعليقات حسب التاريخ من الأقدم إلى الأحدث
        this.comments = data.items.sort((a: any, b: any) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        this.displayedComments = this.comments; // تحديث التعليقات المعروضة
        this.totalPages = data.totalPages;
        this.currentPage = data.page;
        this.itemsPerPage = data.pageSize;

        // إنشاء مصفوفة الصفحات
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        if (this.comments.length === 0) {
          this.nocommentsMessage = 'لا توجد تعليقات لهذا الإعلان';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في جلب تعليقات الإعلان ${advertId}:`, error);
        this.nocommentsMessage = 'فشل جلب التعليقات';
        this.loading = false;
      },
    });
  }

  // دالة لتغيير الصفحة
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && this.advertId) {
      this.currentPage = page;
      this.fetchAdvertisementComment(this.advertId, this.currentPage, this.itemsPerPage);
    }
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}

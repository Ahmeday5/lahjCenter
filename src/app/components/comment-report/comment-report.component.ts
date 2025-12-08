import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-comment-report',
  standalone: true,
  imports: [],
  templateUrl: './comment-report.component.html',
  styleUrl: './comment-report.component.scss',
})
export class CommentReportComponent implements OnInit {
  loading: boolean = true;
  commentsReport: any[] = [];
  nocommentsReportMessage: string | null = null;
  commentsReportMessage: string | null = null;
  displayedCommentsReport: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchreportComment(this.currentPage, this.itemsPerPage);
  }

  fetchreportComment(page: number, pageSize: number) {
    this.loading = true;
    this.nocommentsReportMessage = null;
    this.commentsReportMessage = null;

    this.apiService.getcommentReports(page, pageSize).subscribe({
      next: (data) => {
        // ترتيب التعليقات حسب التاريخ من الأقدم إلى الأحدث
        this.commentsReport = data.items.sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        this.displayedCommentsReport = this.commentsReport; // تحديث التعليقات المعروضة
        this.totalPages = data.totalPages;
        this.currentPage = data.page;
        this.itemsPerPage = data.pageSize;

        // إنشاء مصفوفة الصفحات
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        if (this.commentsReport.length === 0) {
          this.nocommentsReportMessage = 'لا توجد ابلاغات تعليقات ';
        }

        this.loading = false;
      },
      error: (error) => {
        this.nocommentsReportMessage = 'فشل جلب ابلاغات التعليقات';
        this.loading = false;
      },
    });
  }

  // دالة لتغيير الصفحة
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchreportComment(this.currentPage, this.itemsPerPage);
    }
  }

  approveCommentReport(id: number) {
    if (
      confirm(
        'هل أنت متأكد من قبول الابلاغ ؟ هذا الإجراء سيؤدي الي مسح التعليق!'
      )
    ) {
      this.loading = true;
      this.nocommentsReportMessage = null;
      this.commentsReportMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.approveCommentReport(id).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.commentsReportMessage = 'تم قبول الابلاغ بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 5 ثوانٍ
          // حذف العنصر من القائمة المحليّة
          this.displayedCommentsReport = this.displayedCommentsReport.filter(report => report.id !== id);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في قبول الابلاغ ${id}:`, error);
          this.nocommentsReportMessage = `فشل قبول الابلاغ ${id}`;
          this.loading = false;
        },
      });
    }
  }

  deleteCommentReport(id: number) {
    if (
      confirm(
        'هل انت متاكد من حذف الابلاغ ؟ هذا الإجراء لا يمكن التراجع عنه'
      )
    ) {
      this.loading = true;
      this.nocommentsReportMessage = null;
      this.commentsReportMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.deleteCommentReport(id).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.commentsReportMessage = 'تم حذف الابلاغ بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 5 ثوانٍ
          // حذف العنصر من القائمة المحليّة
          this.displayedCommentsReport = this.displayedCommentsReport.filter(report => report.id !== id);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف الابلاغ ${id}:`, error);
          this.nocommentsReportMessage = `فشل حذف الابلاغ ${id}`;
          this.loading = false;
        },
      });
    }
  }

    DeactivateUser(userId: number) {
    if (
      confirm(
        'هل انت متاكد من حظر هذا المستخدم ؟ هذا الإجراء سيؤدي الي توقف ايميل المستخدم'
      )
    ) {
      this.loading = true;
      this.nocommentsReportMessage = null;
      this.commentsReportMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.DeactivateDeleteRelated(userId).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.commentsReportMessage = 'تم حظر المستخدم بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 5 ثوانٍ
          // حذف العنصر من القائمة المحليّة
          this.displayedCommentsReport = this.displayedCommentsReport.filter(report => report.id !== userId);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حظر المستخدم ${userId}:`, error);
          this.nocommentsReportMessage = `فشل حظر المستخدم ${userId}`;
          this.loading = false;
        },
      });
    }
  }

  // دالة لإزالة رسالة النجاح بعد 3 ثوانٍ
  clearcommentsReportMessage() {
    setTimeout(() => {
      this.commentsReportMessage = null;
    }, 2000);
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}

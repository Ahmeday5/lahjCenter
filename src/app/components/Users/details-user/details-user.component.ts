import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-details-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss'],
})
export class DetailsUserComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  selectedImage: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchUserDetails(userId);
    } else {
      this.errorMessage = 'لم يتم العثور على معرف المستخدم';
      this.loading = false;
    }
  }

  fetchUserDetails(userId: string) {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getUserById(userId).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في جلب تفاصيل المستخدم ${userId}:`, error);
        this.errorMessage = `فشل جلب تفاصيل المستخدم ${userId}`;
        this.loading = false;
      },
    });
  }

  // دالة للانتقال إلى صفحة التعديل
  navigateToEdit() {
    this.router.navigate(['/user/edit', this.user.id]);
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
  
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-details-advertisements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-advertisements.component.html',
  styleUrls: ['./details-advertisements.component.scss'],
})
export class DetailsAdvertisementsComponent implements OnInit {
  advertisement: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  selectedImage: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchAdvertisementDetails(+id);
    } else {
      this.errorMessage = 'لم يتم العثور على معرف الإعلان';
      this.loading = false;
    }
  }

  fetchAdvertisementDetails(id: number) {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getAdvertisementById(id).subscribe({
      next: (data) => {
        this.advertisement = data;
        // تحديد الصورة الأولى كـ default
        this.selectedImage = data.advertisementImages[0] || null;
        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في جلب تفاصيل الإعلان ${id}:`, error);
        this.errorMessage = `فشل جلب تفاصيل الإعلان ${id}`;
        this.loading = false;
      },
    });
  }

  // دالة لتحديد الصورة عند الضغط عليها
  selectImage(image: any) {
    this.selectedImage = image;
  }

  // دالة لحذف الصورة
  deleteImage(imageId: number) {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      this.loading = true;
      this.errorMessage = null;
      this.apiService.deleteImage(this.advertisement.id, imageId).subscribe({
        next: () => {
          // إزالة الصورة من القائمة بعد الحذف
          this.advertisement.advertisementImages =
            this.advertisement.advertisementImages.filter(
              (img: any) => img.id !== imageId
            );
          // تحديث الصورة المختارة إذا كانت هي اللي اتمسحت
          if (this.selectedImage?.id === imageId) {
            this.selectedImage =
              this.advertisement.advertisementImages[0] || null;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف الصورة ${imageId}:`, error);
          this.errorMessage = `فشل حذف الصورة ${imageId}`;
          this.loading = false;
        },
      });
    }
  }

  // دالة للانتقال إلى صفحة التعديل
  navigateToEdit() {
    this.router.navigate(['/advertisements/edit', this.advertisement.id]);
  }

  // دالة للانتقال إلى صفحة التعليقات
  navigateTocomment() {
    this.router.navigate(['/commentAdvertisements', this.advertisement.id]);
  }

  // دالة لتنسيق التاريخ
  formatDate(date: string): string {
    return date.split('T')[0]; // استخراج YYYY-MM-DD فقط
  }
}

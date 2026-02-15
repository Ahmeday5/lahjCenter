import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-all-slider',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-slider.component.html',
  styleUrl: './all-slider.component.scss',
})
export class AllSliderComponent implements OnInit {
  sliders: any[] = [];
  loading: boolean = true;
  noslidersMessage: string | null = null;
  slidersMessage: string | null = null;
  deleteAdId: number | null = null;
  deletionReason: string = '';
  selectedImage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchAllSliders();
  }

  // دالة لعرض الصورة في الـ modal
  showImage(imageUrl?: string) {
    if (imageUrl) {
      this.selectedImage = imageUrl;
    }
  }

  fetchAllSliders() {
    this.loading = true;
    this.noslidersMessage = null;
    this.apiService.getAllSliders().subscribe({
      next: (data) => {
        this.sliders = Array.isArray(data) ? data : [];
        if (this.sliders.length === 0) {
          this.noslidersMessage = 'لا يوجد بانرات متاحة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب كل البانرات:', error);
        this.noslidersMessage = 'فشل جلب البانرات';
        this.loading = false;
      },
    });
  }

  DeleteSlider(sliderId: number) {
    if (
      confirm(' هل انت متاكد من حذف هذا البانر ؟ هذا الإجراء لا يمكن التراجع عنه')
    ) {
      this.loading = true;
      this.noslidersMessage = null;
      this.slidersMessage = null; // إعادة تعيين رسالة النجاح
      this.apiService.deleteSlider(sliderId).subscribe({
        next: (response) => {
          console.log(response); // "Advertisement Approved Successfully"
          this.slidersMessage = 'تم حذف البانر بنجاح';
          this.clearcommentsReportMessage(); // إزالة الرسالة بعد 2 ثوانٍ
          this.fetchAllSliders();
        },
        error: (error) => {
          console.error(`خطأ في حذف البانر ${sliderId}:`, error);
          this.noslidersMessage = `فشل حذف البانر ${sliderId}`;
          this.loading = false;
        },
      });
    }
  }

  // دالة لإزالة رسالة النجاح بعد 2 ثوانٍ
  clearcommentsReportMessage() {
    setTimeout(() => {
      this.slidersMessage = null;
    }, 2000);
  }
}

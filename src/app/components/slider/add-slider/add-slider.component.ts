import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-slider',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-slider.component.html',
  styleUrl: './add-slider.component.scss',
})
export class AddSliderComponent {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  formData = {
    Image: null as File | null, // لحفظ ملف الصورة
    ImageUrl: '', // لعرض معاينة الصورة
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  // دالة لمعالجة رفع الصورة
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.Image = input.files[0]; // حفظ الملف
      this.formData.ImageUrl = URL.createObjectURL(input.files[0]); // عرض معاينة الصورة
    }
  }

  submitForm() {
    // إنشاء FormData
    const formData = new FormData();
    if (this.formData.Image) {
      formData.append('Image', this.formData.Image);
    }

    // بدء عملية التحميل
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // إرسال البيانات للـ API
    this.apiService.addslider(formData).subscribe({
      next: () => {
        this.successMessage = 'تم إضافة البانر بنجاح';
        this.loading = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('خطأ في إضافة البانر:', error);
        this.errorMessage = `تعذر إضافة البانر: ${
          error.message || 'خطأ غير معروف'
        }`;
        this.loading = false;
      },
    });
  }

  // مسح الرسائل وإعادة تعيين النموذج بعد 3 ثوانٍ
  clearMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
      // إعادة تعيين النموذج
      this.formData = {
        Image: null,
        ImageUrl: '',
      };
      if (this.imageInput) {
        this.imageInput.nativeElement.value = '';
      }
      // إعادة التوجيه إلى قائمة المستخدمين
      //this.router.navigate(['/all-user']);
    }, 2000);
  }
}

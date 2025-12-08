import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.scss'
})
export class AddServiceComponent {
formData = {
    arName: '',
    enName: ''
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  submitForm() {
    // التحقق من إدخال البيانات
    if (!this.formData.arName || !this.formData.enName) {
      this.errorMessage = 'اسم الخدمة بالعربي وبالانجليزي مطلوب';
      return;
    }

    // بدء عملية التحميل
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // إرسال البيانات للـ API
    this.apiService.addServices(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'تم اضافة الخدمة بنجاح';
        this.loading = false;
        this.clearMessages();
        this.formData.arName = '';
        this.formData.enName = '';
      },
      error: (error) => {
        console.error(' خطا في اضافة الخدمة:', error);
        this.errorMessage = 'تعذر اضافة الخدمة';
        this.loading = false;
      }
    });
  }

  // مسح الرسائل بعد 3 ثواني
  clearMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }
}

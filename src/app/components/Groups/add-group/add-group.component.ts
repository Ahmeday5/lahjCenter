import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent {
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
      this.errorMessage = 'اسم الفئة بالعربي وبالانجليزي مطلوب';
      return;
    }

    // بدء عملية التحميل
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // إرسال البيانات للـ API
    this.apiService.addGroup(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'تم اضافة الفئة بنجاح';
        this.loading = false;
        this.clearMessages();
        this.formData.arName = '';
        this.formData.enName = '';
      },
      error: (error) => {
        console.error(' خطا في اضافة الفئة:', error);
        this.errorMessage = 'تعذر اضافة الفئة';
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
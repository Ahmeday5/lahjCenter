import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-currency',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-currency.component.html',
  styleUrl: './add-currency.component.scss'
})
export class AddcurrencyComponent {
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
      this.errorMessage = 'اسم العملة بالعربي وبالانجليزي مطلوب';
      return;
    }

    // بدء عملية التحميل
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // إرسال البيانات للـ API
    this.apiService.addCurrencies(this.formData).subscribe({
      next: (response) => {
        this.successMessage = 'تم اضافة العملة بنجاح';
        this.loading = false;
        this.clearMessages();
        this.formData.arName = '';
        this.formData.enName = '';
      },
      error: (error) => {
        console.error(' خطا في اضافة العملة:', error);
        this.errorMessage = 'تعذر اضافة العملة';
        this.loading = false;
      }
    });
  }

  // مسح الرسائل بعد 3 ثواني
  clearMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 2000);
  }
}

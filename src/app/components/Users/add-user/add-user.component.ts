import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  formData = {
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    PhoneNumber: '',
    Image: null as File | null, // لحفظ ملف الصورة
    ImageUrl: '', // لعرض معاينة الصورة
    Activity: '',
    Role: '',
  };
  roles: string[] = ['Admin', 'Member'];
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
    // التحقق من الحقول المطلوبة
    if (
      !this.formData.FirstName ||
      !this.formData.LastName ||
      !this.formData.Email ||
      !this.formData.Password ||
      !this.formData.PhoneNumber ||
      !this.formData.Role
    ) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    // التحقق من تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.Email)) {
      this.errorMessage = 'البريد الإلكتروني غير صحيح';
      return;
    }

    // التحقق من تنسيق رقم الهاتف
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(this.formData.PhoneNumber)) {
      this.errorMessage = 'رقم الهاتف غير صحيح';
      return;
    }

    // التحقق من كلمة المرور (6 أحرف على الأقل)
    if (this.formData.Password.length < 6) {
      this.errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      return;
    }

    // إنشاء FormData
    const formData = new FormData();
    formData.append('FirstName', this.formData.FirstName);
    formData.append('LastName', this.formData.LastName);
    formData.append('Email', this.formData.Email);
    formData.append('Password', this.formData.Password);
    formData.append('PhoneNumber', this.formData.PhoneNumber);
    formData.append('Role', this.formData.Role);
    if (this.formData.Activity) {
      formData.append('Activity', this.formData.Activity);
    }
    if (this.formData.Image) {
      formData.append('Image', this.formData.Image);
    }

    // بدء عملية التحميل
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // إرسال البيانات للـ API
    this.apiService.adduser(formData).subscribe({
      next: () => {
        this.successMessage = 'تم إضافة المستخدم بنجاح';
        this.loading = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('خطأ في إضافة المستخدم:', error);
        this.errorMessage = `تعذر إضافة المستخدم: ${error.message || 'خطأ غير معروف'}`;
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
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        PhoneNumber: '',
        Image: null,
        ImageUrl: '',
        Activity: '',
        Role: '',
      };
      // إعادة التوجيه إلى قائمة المستخدمين
      this.router.navigate(['/all-user']);
    }, 2000);
  }
}

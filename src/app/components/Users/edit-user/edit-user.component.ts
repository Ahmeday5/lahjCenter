import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})

export class EditUserComponent implements OnInit {
  user: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  formData: any = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    image: null, // لحفظ ملف الصورة
    imageUrl: '', // لعرض الصورة الحالية
    activity: '',
    role: '',
  };
  roles: string[] = ['Admin', 'Member'];
  private originalImageUrl: string | null = null; // لتخزين رابط الصورة القديمة

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchUserDetails(id);
    } else {
      this.errorMessage = 'لم يتم العثور على معرف المستخدم';
      this.loading = false;
    }
  }

  fetchUserDetails(id: string) {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.formData = {
          id: data.id || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          image: null,
          imageUrl: data.imageUrl || '',
          activity: data.activity || '',
          role:
            data.roles && data.roles.length > 0
              ? data.roles[0]
              : data.role || '', // محاولة جلب الدور من roles أو role
        };
        this.originalImageUrl = data.imageUrl || null; // تخزين الصورة القديمة
        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في جلب تفاصيل المستخدم ${id}:`, error);
        this.errorMessage = `فشل جلب تفاصيل المستخدم ${id}`;
        this.loading = false;
      },
    });
  }

  // دالة لمعالجة رفع الصورة
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.image = input.files[0]; // حفظ الملف
      this.formData.imageUrl = URL.createObjectURL(input.files[0]); // عرض معاينة الصورة
    }
  }

  // إرسال التعديلات
  submitForm() {
    // التحقق من الحقول المطلوبة
    if (
      !this.formData.firstName ||
      !this.formData.lastName ||
      !this.formData.email ||
      !this.formData.phoneNumber ||
      !this.formData.role
    ) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    // التحقق من تنسيق البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.errorMessage = 'البريد الإلكتروني غير صحيح';
      return;
    }

    // التحقق من تنسيق رقم الهاتف
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(this.formData.phoneNumber)) {
      this.errorMessage = 'رقم الهاتف غير صحيح';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // إنشاء FormData
    const formData = new FormData();
    formData.append('id', this.formData.id.toString()); // تصحيح من Id إلى id
    formData.append('firstName', this.formData.firstName);
    formData.append('lastName', this.formData.lastName);
    formData.append('email', this.formData.email);
    formData.append('phoneNumber', this.formData.phoneNumber);
    formData.append('role', this.formData.role);
    if (this.formData.activity) {
      formData.append('activity', this.formData.activity);
    }
    if (this.formData.image) {
      formData.append('image', this.formData.image);
    }

    this.apiService.updateUser(formData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'تم تعديل بيانات المستخدم بنجاح';
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/users']); // تغيير إلى /users بدلاً من user-details
        }, 2000);
      },
      error: (error) => {
        console.error(`خطأ في تعديل المستخدم ${this.formData.id}:`, error);
        this.errorMessage = `فشل تعديل المستخدم: ${
          error.message || 'خطأ غير معروف'
        }`;
        this.loading = false;
      },
    });
  }
}

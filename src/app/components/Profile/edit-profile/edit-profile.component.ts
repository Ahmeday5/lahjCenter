import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent implements OnInit {
  formData = {
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: '',
    Activity: '',
    Image: null as File | null,
    ImageUrl: '',
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchMyProfile();
  }

  fetchMyProfile() {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getMyProfile().subscribe({
      next: (data) => {
        this.formData.FirstName = data.firstName || '';
        this.formData.LastName = data.lastName || '';
        this.formData.Email = data.email || '';
        this.formData.PhoneNumber = data.phoneNumber || '';
        this.formData.Activity = data.activity || '';
        this.formData.ImageUrl = data.imageUrl || '';
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب الملف الشخصي:', error);
        this.errorMessage = error.message || 'فشل جلب الملف الشخصي';
        this.loading = false;
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.formData.Image = input.files[0];
      this.formData.ImageUrl = URL.createObjectURL(input.files[0]);
    }
  }

  submitForm() {
    if (!this.formData.FirstName || !this.formData.LastName || !this.formData.Email || !this.formData.PhoneNumber) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.Email)) {
      this.errorMessage = 'البريد الإلكتروني غير صحيح';
      return;
    }

    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(this.formData.PhoneNumber)) {
      this.errorMessage = 'رقم الهاتف غير صحيح';
      return;
    }

    const formData = new FormData();
    formData.append('FirstName', this.formData.FirstName);
    formData.append('LastName', this.formData.LastName);
    formData.append('Email', this.formData.Email);
    formData.append('PhoneNumber', this.formData.PhoneNumber);
    if (this.formData.Activity) {
      formData.append('Activity', this.formData.Activity);
    }
    if (this.formData.Image) {
      formData.append('Image', this.formData.Image);
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateProfile(formData).subscribe({
      next: () => {
        this.successMessage = 'تم تحديث الملف الشخصي بنجاح';
        this.loading = false;
        this.clearMessages();
      },
      error: (error) => {
        console.error('خطأ في تحديث الملف الشخصي:', error);
        this.errorMessage = error.message || 'تعذر تحديث الملف الشخصي';
        this.loading = false;
      },
    });
  }

  clearMessages() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
      this.router.navigate(['/my-profile']);
    }, 3000);
  }
}

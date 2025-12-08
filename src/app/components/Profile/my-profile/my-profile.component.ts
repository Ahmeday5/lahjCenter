import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  myProfile: any = null;
  loading: boolean = true;
  nomyProfileMessage: string | null = null;
  passwordForm = {
    oldPassword: '',
    newPassword: '',
  };
  passwordLoading: boolean = false;
  passwordErrorMessage: string | null = null;
  passwordSuccessMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchMyProfile();
  }

  fetchMyProfile() {
    this.loading = true;
    this.nomyProfileMessage = null;
    this.apiService.getMyProfile().subscribe({
      next: (data) => {
        this.myProfile = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب الملف الشخصي:', error);
        this.nomyProfileMessage = error.message || 'فشل جلب الملف الشخصي';
        this.loading = false;
      },
    });
  }

  updatePassword() {
    if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword) {
      this.passwordErrorMessage = 'يرجى ملء جميع الحقول';
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.passwordErrorMessage = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل';
      return;
    }
    this.passwordLoading = true;
    this.passwordErrorMessage = null;
    this.passwordSuccessMessage = null;

    this.apiService.updatePassword(this.passwordForm).subscribe({
      next: () => {
        this.passwordSuccessMessage = 'تم تعديل كلمة المرور بنجاح';
        this.passwordLoading = false;
        this.clearPasswordMessages();
      },
      error: (error) => {
        console.error('خطأ في تحديث كلمة المرور:', error);
        this.passwordErrorMessage = error.message || 'تعذر تحديث كلمة المرور';
        this.passwordLoading = false;
      },
    });
  }

  clearPasswordMessages() {
    setTimeout(() => {
      this.passwordSuccessMessage = null;
      this.passwordErrorMessage = null;
      this.passwordForm = { oldPassword: '', newPassword: '' };
    }, 3000);
  }

  navigateToEditProfile() {
    this.router.navigate(['/edit-profile']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-subgroup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-subgroup.component.html',
  styleUrl: './add-subgroup.component.scss'
})
export class AddSubgroupComponent implements OnInit {
  formData = {
    arName: '',
    enName: '',
    groupId: 0
  };

  groups: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: () => {
        this.errorMessage = 'فشل تحميل الفئات الرئيسية';
      }
    });
  }

  submitForm(): void {
    if (!this.formData.arName || !this.formData.enName || this.formData.groupId === 0) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.addSubGroup(this.formData).subscribe({
      next: () => {
        this.successMessage = 'تم إضافة الفئة الفرعية بنجاح';
        this.formData = { arName: '', enName: '', groupId: 0 };
        this.loading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: () => {
        this.errorMessage = 'فشل إضافة الفئة الفرعية';
        this.loading = false;
      }
    });
  }
}

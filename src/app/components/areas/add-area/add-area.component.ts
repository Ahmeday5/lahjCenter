import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-area',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-area.component.html',
  styleUrl: './add-area.component.scss'
})
export class AddAreaComponent implements OnInit {
  formData = { arName: '', enName: '', governorateId: 0 };
  governorates: any[] = [];
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGovernorates();
  }

  loadGovernorates(): void {
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => this.governorates = data,
      error: () => this.errorMessage = 'فشل تحميل المحافظات'
    });
  }

  submitForm(): void {
    if (!this.formData.arName || !this.formData.enName || this.formData.governorateId === 0) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return;
    }

    this.loading = true;
    this.apiService.addArea(this.formData).subscribe({
      next: () => {
        this.successMessage = 'تم إضافة المنطقة بنجاح';
        this.formData = { arName: '', enName: '', governorateId: 0 };
        this.loading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: () => {
        this.errorMessage = 'فشل إضافة المنطقة';
        this.loading = false;
      }
    });
  }
}

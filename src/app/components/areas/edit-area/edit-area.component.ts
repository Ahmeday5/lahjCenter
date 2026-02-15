import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-area',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-area.component.html',
  styleUrl: './edit-area.component.scss'
})
export class EditAreaComponent implements OnInit {

  areaId: number = 0;

  area = {
    id: 0,
    arName: '',
    enName: '',
    governorateId: 0
  };

  governorates: any[] = [];

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // جلب الـ ID من الـ URL (مثال: /edit-area/4)
    this.areaId = +this.route.snapshot.paramMap.get('id')!;

    this.loadGovernorates();
    this.loadAreaDetails();
  }

  // جلب قائمة المحافظات للـ dropdown
  loadGovernorates(): void {
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => {
        this.governorates = data;
      },
      error: () => {
        this.errorMessage = 'فشل تحميل قائمة المحافظات';
      }
    });
  }

  // جلب بيانات المنطقة الحالية حسب الـ ID
  loadAreaDetails(): void {
    this.loading = true;
    this.errorMessage = null;

    this.apiService.getAllAreas().subscribe({
      next: (areas) => {
        const foundArea = areas.find((a: any) => a.id === this.areaId);

        if (foundArea) {
          this.area = {
            id: foundArea.id,
            arName: foundArea.arName,
            enName: foundArea.enName,
            governorateId: foundArea.governorateId
          };
        } else {
          this.errorMessage = 'لم يتم العثور على المنطقة';
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل جلب بيانات المنطقة';
        this.loading = false;
      }
    });
  }

  // حفظ التعديلات
  updateArea(): void {
    if (!this.area.arName || !this.area.enName || this.area.governorateId === 0) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // نرسل الكائن كامل (مع الـ id)
    this.apiService.updateArea(this.area).subscribe({
      next: () => {
        this.successMessage = 'تم تعديل المنطقة بنجاح';
        this.loading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: () => {
        this.errorMessage = 'فشل تعديل المنطقة';
        this.loading = false;
      }
    });
  }
}

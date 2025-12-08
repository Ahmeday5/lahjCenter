import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-Governorate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-Governorate.component.html',
  styleUrl: './edit-Governorate.component.scss',
})
export class EditGovernorateComponent implements OnInit {
  governorateId: number = 0;
  governorateData = {
    id: 0,
    arName: '',
    enName: '',
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.governorateId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchGovernorateDetails();
  }

  fetchGovernorateDetails() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => {
        const governorate = data.find((g: any) => g.id === this.governorateId);
        if (governorate) {
          this.governorateData = {
            id: governorate.id,
            arName: governorate.arName,
            enName: governorate.enName,
          };
        } else {
          this.errorMessage = 'لم يتم العثور على المحافظة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب تفاصيل المحافظة:', error);
        this.errorMessage = 'فشل جلب تفاصيل المحافظة';
        this.loading = false;
      },
    });
  }

  updateGovernorate() {
    if (!this.governorateData.arName || !this.governorateData.enName) {
      this.errorMessage = 'يرجى ملء الاسم بالعربي والإنجليزي';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateGovernorates(this.governorateId, this.governorateData).subscribe({
      next: (response) => {
        this.successMessage = 'تم تعديل المحافظة بنجاح';
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 2000);
      },
      error: (error) => {
        console.error('خطأ في تعديل المحافظة:', error);
        this.errorMessage = 'فشل تعديل المحافظة';
        this.loading = false;
      },
    });
  }
}

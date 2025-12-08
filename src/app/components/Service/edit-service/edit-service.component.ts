import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss',
})
export class EditServiceComponent implements OnInit {
  serviceId: number = 0;
  serviceData = {
    id: 0,
    arName: '',
    enName: '',
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.serviceId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchServiceDetails();
  }

  fetchServiceDetails() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.apiService.getAllServices().subscribe({
      next: (data) => {
        const service = data.find((g: any) => g.id === this.serviceId);
        if (service) {
          this.serviceData = {
            id: service.id,
            arName: service.arName,
            enName: service.enName,
          };
        } else {
          this.errorMessage = 'لم يتم العثور على الخدمة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب تفاصيل الخدمة:', error);
        this.errorMessage = 'فشل جلب تفاصيل الخدمة';
        this.loading = false;
      },
    });
  }

  updateServices() {
    if (!this.serviceData.arName || !this.serviceData.enName) {
      this.errorMessage = 'يرجى ملء الاسم بالعربي والإنجليزي';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateServices(this.serviceId, this.serviceData).subscribe({
      next: (response) => {
        this.successMessage = 'تم تعديل الخدمة بنجاح';
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (error) => {
        console.error('خطأ في تعديل الخدمة:', error);
        this.errorMessage = 'فشل تعديل الخدمة';
        this.loading = false;
      },
    });
  }
}

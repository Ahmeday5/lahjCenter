import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-currency',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-currency.component.html',
  styleUrl: './edit-currency.component.scss',
})
export class EditcurrencyComponent implements OnInit {
  currencyId: number = 0;
  currencyData = {
    id: 0,
    arName: '',
    enName: '',
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.currencyId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchCurrencyDetails();
  }

  fetchCurrencyDetails() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.apiService.getAllCurrencies().subscribe({
      next: (data) => {
        const currency = data.find((g: any) => g.id === this.currencyId);
        if (currency) {
          this.currencyData = {
            id: currency.id,
            arName: currency.arName,
            enName: currency.enName,
          };
        } else {
          this.errorMessage = 'لم يتم العثور على العملة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب تفاصيل العملة:', error);
        this.errorMessage = 'فشل جلب تفاصيل العملة';
        this.loading = false;
      },
    });
  }

  updateCurrency() {
    if (!this.currencyData.arName || !this.currencyData.enName) {
      this.errorMessage = 'يرجى ملء الاسم بالعربي والإنجليزي';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateCurrencies(this.currencyId, this.currencyData).subscribe({
      next: (response) => {
        this.successMessage = 'تم تعديل العملة بنجاح';
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 2000);
      },
      error: (error) => {
        console.error('خطأ في تعديل العملة:', error);
        this.errorMessage = 'فشل تعديل العملة';
        this.loading = false;
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { PaginationComponent } from "../../../layout/pagination/pagination.component";

@Component({
  selector: 'app-all-currency',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './all-currency.component.html',
  styleUrl: './all-currency.component.scss',
})
export class AllcurrencyComponent implements OnInit {
  Currencies: any[] = [];
  loading: boolean = true;
  nocurrencyMessage: string | null = null;
  currencyMessage: string | null = null;
  displayedCurrencies: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pages: number[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.fetchcurrency();
  }

  fetchcurrency() {
    this.loading = true;
    this.currentPage = 1;
    this.nocurrencyMessage = null;
    this.currencyMessage = null;
    this.apiService.getAllCurrencies().subscribe({
      next: (data) => {
        this.Currencies = data;
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب العملات:', error);
        this.nocurrencyMessage = 'فشل جلب العملات';
        this.loading = false;
      },
    });
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.Currencies.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateDisplayedCurrencies();
  }

  updateDisplayedCurrencies() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCurrencies = this.Currencies.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedCurrencies();
    }
  }

  deleteCurrency(id: number) {
    if (confirm('هل أنت متأكد من حذف هذه العملة')) {
      this.loading = true;
      this.apiService.deleteCurrencies(id).subscribe({
        next: (response) => {
          this.currencyMessage = 'تم حذف العملة بنجاح';
          setTimeout(() => {
            this.currencyMessage = null;
            this.fetchcurrency(); // إعادة جلب الفئات بعد الحذف
          }, 2000);
          this.loading = false;
        },
        error: (error) => {
          console.error(`خطأ في حذف العملة ${id}:`, error);
          this.nocurrencyMessage = 'فشل حذف العملة';
          this.loading = false;
          setTimeout(() => {
            this.nocurrencyMessage = null;
          }, 2000);
        },
      });
    }
  }

  editCurrency(id: number) {
    this.router.navigate(['/edit-currency', id]);
  }
}

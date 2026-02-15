import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-subgroup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-subgroup.component.html',
  styleUrl: './edit-subgroup.component.scss'
})
export class EditSubgroupComponent implements OnInit {

  subgroupId: number = 0;

  subgroup = {
    id: 0,
    arName: '',
    enName: '',
    groupId: 0
  };

  groups: any[] = [];

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.subgroupId = +this.route.snapshot.paramMap.get('id')!;

    this.loadGroups();
    this.loadSubgroupDetails();
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

  loadSubgroupDetails(): void {
    this.loading = true;
    this.errorMessage = null;

    this.apiService.getAllSubGroups().subscribe({
      next: (subgroups) => {
        const found = subgroups.find((s: any) => s.id === this.subgroupId);

        if (found) {
          this.subgroup = {
            id: found.id,
            arName: found.arName,
            enName: found.enName,
            groupId: found.groupId
          };
        } else {
          this.errorMessage = 'لم يتم العثور على الفئة الفرعية';
        }

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'فشل جلب بيانات الفئة الفرعية';
        this.loading = false;
      }
    });
  }

  updateSubGroup(): void {
    if (!this.subgroup.arName || !this.subgroup.enName || this.subgroup.groupId === 0) {
      this.errorMessage = 'جميع الحقول مطلوبة';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateSubGroup(this.subgroup).subscribe({
      next: () => {
        this.successMessage = 'تم تعديل الفئة الفرعية بنجاح';
        this.loading = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: () => {
        this.errorMessage = 'فشل تعديل الفئة الفرعية';
        this.loading = false;
      }
    });
  }
}

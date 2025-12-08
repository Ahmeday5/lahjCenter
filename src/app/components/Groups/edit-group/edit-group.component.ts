import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-group',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-group.component.html',
  styleUrl: './edit-group.component.scss',
})
export class EditGroupComponent implements OnInit {
  groupId: number = 0;
  groupData = {
    id: 0,
    arName: '',
    enName: '',
  };
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchGroupDetails();
  }

  fetchGroupDetails() {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        const group = data.find((g: any) => g.id === this.groupId);
        if (group) {
          this.groupData = {
            id: group.id,
            arName: group.arName,
            enName: group.enName,
          };
        } else {
          this.errorMessage = 'لم يتم العثور على الفئة';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('خطأ في جلب تفاصيل الفئة:', error);
        this.errorMessage = 'فشل جلب تفاصيل الفئة';
        this.loading = false;
      },
    });
  }

  updateGroup() {
    if (!this.groupData.arName || !this.groupData.enName) {
      this.errorMessage = 'يرجى ملء الاسم بالعربي والإنجليزي';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.apiService.updateGroup(this.groupId, this.groupData).subscribe({
      next: (response) => {
        this.successMessage = 'تم تعديل الفئة بنجاح';
        this.loading = false;
        setTimeout(() => (this.successMessage = null), 3000);
      },
      error: (error) => {
        console.error('خطأ في تعديل الفئة:', error);
        this.errorMessage = 'فشل تعديل الفئة';
        this.loading = false;
      },
    });
  }
}

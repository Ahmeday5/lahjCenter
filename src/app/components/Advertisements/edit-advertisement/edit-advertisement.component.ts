import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-edit-advertisement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-advertisement.component.html',
  styleUrls: ['./edit-advertisement.component.scss'],
})
export class EditAdvertisementComponent implements OnInit {
  advertisement: any = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  formData: any = {
    id: 0,
    name: '',
    phone: '',
    groupId: 0,
    serviceId: 0,
    price: 0,
    isCloseReplies: false,
    currencyId: 0,
    governorateId: 0,
    area: '',
    description: '',
    imagesToAdd: [], // مش هنستخدمها لأننا هنبعت الصور كـ FormData
    imagesToDelete: [],
  };
  newImages: File[] = []; // لتخزين الملفات المختارة
  selectedImage: any = null; // لتخزين الصورة المختارة
  imagePreviews: string[] = []; // لعرض معاينة الصور الجديدة
  groups: any[] = []; // لتخزين الفئات
  services: any[] = []; // لتخزين الخدمات
  currencies: any[] = []; // لتخزين العملات
  governorates: any[] = []; // لتخزين المحافظات

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchAdvertisementDetails(+id);
      this.fetchGroups();
      this.fetchServices();
      this.fetchCurrencies();
      this.fetchGovernorates();
    } else {
      this.errorMessage = 'لم يتم العثور على معرف الإعلان';
      this.loading = false;
    }
  }

  fetchAdvertisementDetails(id: number) {
    this.loading = true;
    this.errorMessage = null;
    this.apiService.getAdvertisementById(id).subscribe({
      next: (data) => {
        this.advertisement = data;
        // تعبئة الفورم بالبيانات الحالية
        this.formData = {
          id: data.id,
          name: data.name || '',
          phone: data.phone || '',
          groupId: data.groupId || 0,
          serviceId: data.serviceId || 0,
          price: data.price || 0,
          isCloseReplies: data.isCloseReplies || false,
          currencyId: data.currencyId || 0,
          governorateId: data.governorateId || 0,
          area: data.area || '',
          description: data.description || '',
          imagesToAdd: [],
          imagesToDelete: [],
        };
        // تحديد الصورة الأولى كـ default
        this.selectedImage = data.advertisementImages[0] || null;
        this.loading = false;
      },
      error: (error) => {
        console.error(`خطأ في جلب تفاصيل الإعلان ${id}:`, error);
        this.errorMessage = `فشل جلب تفاصيل الإعلان ${id}`;
        this.loading = false;
      },
    });
  }

  // جلب الفئات
  fetchGroups() {
    this.apiService.getAllGroups().subscribe({
      next: (data) => {
        this.groups = data;
      },
      error: (error) => {
        console.error('خطأ في جلب الفئات:', error);
        this.errorMessage = 'فشل جلب الفئات';
      },
    });
  }

  // جلب الخدمات
  fetchServices() {
    this.apiService.getAllServices().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (error) => {
        console.error('خطأ في جلب الخدمات:', error);
        this.errorMessage = 'فشل جلب الخدمات';
      },
    });
  }

  // جلب العملات
  fetchCurrencies() {
    this.apiService.getAllCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (error) => {
        console.error('خطأ في جلب العملات:', error);
        this.errorMessage = 'فشل جلب العملات';
      },
    });
  }

  // جلب المحافظات
  fetchGovernorates() {
    this.apiService.getAllGovernorates().subscribe({
      next: (data) => {
        this.governorates = data;
      },
      error: (error) => {
        console.error('خطأ في جلب المحافظات:', error);
        this.errorMessage = 'فشل جلب المحافظات';
      },
    });
  }

  // التعامل مع اختيار الصور الجديدة
  onFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.newImages = files;
    // إنشاء معاينة للصور الجديدة
    this.imagePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // تحديد الصورة المختارة
  selectImage(image: any) {
    this.selectedImage = image;
  }

  // حذف صورة موجودة
  deleteExistingImage(imageId: number) {
    if (confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      this.formData.imagesToDelete.push({ id: imageId });
      this.advertisement.advertisementImages =
        this.advertisement.advertisementImages.filter(
          (img: any) => img.id !== imageId
        );
      // تحديث الصورة المختارة إذا كانت هي اللي اتمسحت
      if (this.selectedImage?.id === imageId) {
        this.selectedImage = this.advertisement.advertisementImages[0] || null;
      }
    }
  }

  // حذف الصورة المختارة باستخدام الـ API
  deleteSelectedImage() {
    if (!this.selectedImage) {
      this.errorMessage = 'يرجى اختيار صورة لحذفها';
      return;
    }
    if (confirm('هل أنت متأكد من حذف الصورة المختارة؟')) {
      this.loading = true;
      this.errorMessage = null;
      this.apiService
        .deleteImage(this.advertisement.id, this.selectedImage.id)
        .subscribe({
          next: () => {
            // إزالة الصورة من القائمة بعد الحذف
            this.advertisement.advertisementImages =
              this.advertisement.advertisementImages.filter(
                (img: any) => img.id !== this.selectedImage.id
              );
            // تحديث الصورة المختارة
            this.selectedImage =
              this.advertisement.advertisementImages[0] || null;
            this.loading = false;
          },
          error: (error) => {
            console.error(`خطأ في حذف الصورة ${this.selectedImage.id}:`, error);
            this.errorMessage = `فشل حذف الصورة ${this.selectedImage.id}`;
            this.loading = false;
          },
        });
    }
  }

  // إرسال التعديلات
  submitForm() {
    // التحقق من الحقول المطلوبة
    if (
      !this.formData.name ||
      !this.formData.phone ||
      !this.formData.groupId ||
      !this.formData.serviceId
    ) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // إنشاء FormData
    const formData = new FormData();
    formData.append('id', this.formData.id.toString());
    formData.append('name', this.formData.name);
    formData.append('phone', this.formData.phone);
    formData.append('groupId', this.formData.groupId.toString());
    formData.append('serviceId', this.formData.serviceId.toString());
    formData.append('price', this.formData.price.toString());
    formData.append('isCloseReplies', this.formData.isCloseReplies.toString()); // عكس القيمة
    formData.append('currencyId', this.formData.currencyId.toString());
    formData.append('governorateId', this.formData.governorateId.toString());
    formData.append('area', this.formData.area || '');
    formData.append('description', this.formData.description || '');

    // إضافة الصور الجديدة
    this.newImages.forEach((file, index) => {
      formData.append('imagesToAdd', file, file.name);
    });

    // إضافة الصور المراد حذفها
    this.formData.imagesToDelete.forEach(
      (img: { id: number }, index: number) => {
        formData.append(`imagesToDelete[${index}].id`, img.id.toString());
      }
    );

    this.apiService.updateAdvertisement(formData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'تم تعديل البيانات بنجاح';
        this.imagePreviews = [];
        this.newImages = [];

        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
        this.fetchAdvertisementDetails(this.formData.id);
      },
      error: (error) => {
        console.error(`خطأ في تعديل الإعلان ${this.formData.id}:`, error);
        this.errorMessage = `فشل تعديل الإعلان ${this.formData.id}: ${
          error.message || 'خطأ غير معروف'
        }`;
        this.loading = false;
      },
    });
  }
}

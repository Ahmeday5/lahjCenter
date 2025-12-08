import { CanActivateFn, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllAdvertisementComponent } from './components/Advertisements/all-advertisement/all-advertisement.component';
import { AllUserComponent } from './components/Users/all-user/all-user.component';
import { DetailsUserComponent } from './components/Users/details-user/details-user.component';
import { EditUserComponent } from './components/Users/edit-user/edit-user.component';
import { AddUserComponent } from './components/Users/add-user/add-user.component';
import { MyProfileComponent } from './components/Profile/my-profile/my-profile.component';
import { EditProfileComponent } from './components/Profile/edit-profile/edit-profile.component';
import { AllGroupComponent } from './components/Groups/all-group/all-group.component';
import { AddGroupComponent } from './components/Groups/add-group/add-group.component';
import { EditGroupComponent } from './components/Groups/edit-group/edit-group.component';
import { AllServiceComponent } from './components/Service/all-service/all-service.component';
import { AddServiceComponent } from './components/Service/add-service/add-service.component';
import { EditServiceComponent } from './components/Service/edit-service/edit-service.component';
import { AllGovernorateComponent } from './components/Governorate/all-Governorate/all-Governorate.component';
import { AddGovernorateComponent } from './components/Governorate/add-Governorate/add-Governorate.component';
import { EditGovernorateComponent } from './components/Governorate/edit-Governorate/edit-Governorate.component';
import { AllcurrencyComponent } from './components/Currency/all-currency/all-Governorate.component';
import { AddcurrencyComponent } from './components/Currency/add-currency/add-currency.component';
import { EditcurrencyComponent } from './components/Currency/edit-currency/edit-currency.component';
import { DetailsAdvertisementsComponent } from './components/Advertisements/details-advertisements/details-advertisements.component';
import { EditAdvertisementComponent } from './components/Advertisements/edit-advertisement/edit-advertisement.component';
import { CommentsAdvertisementComponent } from './components/Advertisements/comments-advertisement/comments-advertisement.component';
import { CommentReportComponent } from './components/comment-report/comment-report.component';
import { AuthService } from './services/auth.service';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const canActivate: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return router.createUrlTree(['/login']);
      }
      return true;
    })
  );
};

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [
      () => {
        const authService = inject(AuthService);
        const router = inject(Router);
        return authService.isLoggedIn$.pipe(
          map((isLoggedIn) => {
            if (isLoggedIn) {
              return router.createUrlTree(['/dashboard']);
            }
            return true;
          })
        );
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'الصفحة الرئيسية' },
  },
  {
    path: 'all-advertisement',
    component: AllAdvertisementComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الإعلانات' },
  },
  {
    path: 'advertisement-details/:id',
    component: DetailsAdvertisementsComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تفاصيل الاعلان' },
  },
  {
    path: 'advertisements/edit/:id',
    component: EditAdvertisementComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل بيانات الاعلان' },
  },
  {
    path: 'all-group',
    component: AllGroupComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الفئات' },
  },
  {
    path: 'add-group',
    component: AddGroupComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إضافة فئة' },
  },
  {
    path: 'edit-group/:id',
    component: EditGroupComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل الفئة' },
  },
  {
    path: 'all-service',
    component: AllServiceComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع الخدمات' },
  },
  {
    path: 'add-service',
    component: AddServiceComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إضافة خدمة' },
  },
  {
    path: 'edit-service/:id',
    component: EditServiceComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل الخدمة' },
  },
  {
    path: 'all-governorate',
    component: AllGovernorateComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع المحافظات' },
  },
  {
    path: 'add-governorate',
    component: AddGovernorateComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إضافة محافظة' },
  },
  {
    path: 'edit-governorate/:id',
    component: EditGovernorateComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل المحافظة' },
  },
  {
    path: 'all-currency',
    component: AllcurrencyComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'جميع العملات' },
  },
  {
    path: 'add-currency',
    component: AddcurrencyComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إضافة عملة' },
  },
  {
    path: 'edit-currency/:id',
    component: EditcurrencyComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل عملة' },
  },
  {
    path: 'all-user',
    component: AllUserComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'إدارة المستخدمين' },
  },
  {
    path: 'user-details/:id',
    component: DetailsUserComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تفاصيل المستخدم' },
  },
  {
    path: 'user/edit/:id',
    component: EditUserComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل بيانات المستخدم' },
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'اضافة مستخدم جديد' },
  },
  {
    path: 'myProfile',
    component: MyProfileComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'حسابي' },
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعديل حسابي' },
  },
  {
    path: 'commentAdvertisements/:id',
    component: CommentsAdvertisementComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'تعليقات الاعلان' },
  },
  {
    path: 'CommentReport',
    component: CommentReportComponent,
    canActivate: [canActivate],
    data: { breadcrumb: 'بلاغات التعليقات' },
  },
  { path: '**', redirectTo: '' },
];

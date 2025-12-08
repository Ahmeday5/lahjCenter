import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  isSidebarOpen: boolean = window.innerWidth > 992;

  menuItems: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.updateMenuItems();
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', () => {
      this.isSidebarOpen = window.innerWidth > 992;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // دالة تسجيل الخروج
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isActive(path: string): boolean {
    return path
      ? this.router.isActive(path, {
          paths: 'subset',
          queryParams: 'subset',
          fragment: 'ignored',
          matrixParams: 'ignored',
        })
      : false;
  }

  // دالة للتحقق إذا كان العنصر هو زر تسجيل الخروج
  isLogoutItem(item: any): boolean {
    return item.label === 'تسجيل الخروج';
  }

  // دالة لفتح/إغلاق القائمة الفرعية
  toggleSubmenu(index: number): void {
    this.menuItems[index].isOpen = !this.menuItems[index].isOpen;
  }

  // تحديث القائمة بناءً على الدور
  private updateMenuItems(): void {
    const baseMenuItems = [
      { label: 'الرئيسية', path: '/dashboard', icons: 'fa-solid fa-house' },
      {
        label: 'الاعلانات',
        path: '/all-advertisement',
        icons: 'fa-solid fa-bullhorn',
      },
      {
        label: 'بلاغات التعليقات',
        path: '/CommentReport',
        icons: 'fa-solid fa-exclamation-triangle',
      },
      {
        label: 'المستخدمين',
        path: null,
        icons: 'fa-solid fa-users',
        isOpen: false,
        submenu: [
          {
            key: 'إدارة المستخدمين',
            path: '/all-user',
            icon: 'fa-solid fa-users',
          },
          {
            key: 'إضافة مستخدم جديد',
            path: '/add-user',
            icon: 'fa-solid fa-user-plus',
          },
        ],
      },
      {
        label: 'الفئات',
        path: null,
        icons: 'fa-solid fa-layer-group',
        isOpen: false,
        submenu: [
          {
            key: 'إدارة الفئات',
            path: '/all-group',
            icon: 'fa-solid fa-list-alt',
          },
          {
            key: 'إضافة فئة جديد',
            path: '/add-group',
            icon: 'fa-solid fa-plus-square',
          },
        ],
      },
      {
        label: 'الخدمات',
        path: null,
        icons: 'fa-solid fa-headset',
        isOpen: false,
        submenu: [
          {
            key: 'إدارة الخدمات',
            path: '/all-service',
            icon: 'fa-solid fa-tasks',
          },
          {
            key: 'إضافة خدمة جديد',
            path: '/add-service',
            icon: 'fa-solid fa-plus-circle',
          },
        ],
      },
      {
        label: 'المحافظات',
        path: null,
        icons: 'fa-solid fa-map-marked-alt',
        isOpen: false,
        submenu: [
          {
            key: 'إدارة المحافظات',
            path: '/all-governorate',
            icon: 'fa-solid fa-map-location',
          },
          {
            key: 'إضافة محافظة جديد',
            path: '/add-governorate',
            icon: 'fa-solid fa-plus-circle',
          },
        ],
      },
      {
        label: 'العملات',
        path: null,
        icons: 'fa-solid fa-coins',
        isOpen: false,
        submenu: [
          {
            key: 'إدارة العملات',
            path: '/all-currency',
            icon: 'fa-solid fa-money-bill-wave',
          },
          {
            key: 'إضافة عملة جديد',
            path: '/add-currency',
            icon: 'fa-solid fa-circle-dollar-to-slot',
          },
        ],
      },
      { label: 'التقارير', path: '/reports', icons: 'fa-solid fa-chart-bar' },
      { label: 'تسجيل الخروج', path: null },
    ];

    this.menuItems = [...baseMenuItems];
  }
}

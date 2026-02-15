import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  activity: string;
  roles: string[];
  token: string | null;
  fullName: string;
  rememberMe?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userData: UserData | null = null;

  constructor() {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        this.userData = JSON.parse(userData) as UserData;
        this.isLoggedInSubject.next(true);
      } catch {
        this.logout();
      }
    }
  }

  login(response: UserData): void {
    this.userData = response;
    this.isLoggedInSubject.next(true);

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(response));
    localStorage.setItem('token', response.token ?? '');

    if (response.rememberMe) {
      localStorage.setItem('savedEmail', response.email);
    } else {
      localStorage.removeItem('savedEmail');
    }
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    this.userData = null;

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('savedEmail');
  }

  getUserData(): UserData | null {
    return this.userData;
  }

  // ✅ ترجع التوكن فقط
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // ✅ فحص حقيقي لانتهاء التوكن
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    const decoded = this.decodeToken(token);
    if (!decoded?.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  }

  getSavedEmail(): string | null {
    const savedEmail = localStorage.getItem('savedEmail');
    console.log('email: ', savedEmail);
    return savedEmail;
  }
}

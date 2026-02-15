import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceToken: string;
}

interface LoginResponse {
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

interface AdvertGroupsTotal {
  groupName: string;
  totalPrice: number;
}

interface UpdateAdvertisement {
  id: number;
  name: string;
  phone: string;
  groupId: number;
  serviceId: number;
  price: number;
  isCloseReplies: boolean;
  currencyId: number;
  governorateId: number;
  area?: string;
  description?: string;
  imagesToAdd?: string[];
  imagesToDelete?: { id: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://78.89.159.126:9393/TheOneAPILahj';

  constructor(private http: HttpClient) {}

  //login

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    // العائدة من الدالة هتبقى Observable من نوع any (يمكن نحدده لاحقًا زي { token: string })
    const loginUrl = `${this.baseUrl}/api/Member/login`;

    return this.http.post<LoginResponse>(loginUrl, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'حدث خطأ غير معروف';
        if (error.status === 0) {
          errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
        } else if (error.status === 401) {
          errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        } else if (error.status === 503) {
          errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
        }
        console.error('خطأ في تسجيل الدخول:', error);
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  /*****************************************dashboard***********************************************************/

  getAdvertGroupsTotal(): Observable<AdvertGroupsTotal> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Advertisement/GetAdvertGroupsTotal`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب اسعار الفئات:', error);
          return throwError(() => new Error('فشل جلب اسعار الفئات'));
        })
      );
  }

  /******************************************Groups*********************************************************/

  // جلب كل الفئات
  getAllGroups(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Group/getAllGroups`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب الفئات:', error);
          return throwError(() => new Error('فشل جلب الفئات'));
        })
      );
  }

  // إضافة فئة جديدة
  addGroup(data: { arName: string; enName: string }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Group/addGroup`;
    return this.http.post<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('خطأ في إضافة الفئة:', error);
        return throwError(() => new Error('فشل إضافة الفئة'));
      })
    );
  }

  //مسح الفئة
  deleteGroup(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Group/deleteGroup?id=${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الفئة ${id}:`, error);
          return throwError(() => new Error(`فشل حذف الفئة ${id}`));
        })
      );
  }

  // دالة تعديل الفئة
  updateGroup(
    id: number,
    data: { id: number; arName: string; enName: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Group/updateGroup?id=${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في تعديل الفئة ${id}:`, error);
        return throwError(() => new Error(`فشل تعديل الفئة ${id}`));
      })
    );
  }

  /********************************** SubGroups - الفئات الفرعية **********************************/

  // جلب كل الفئات الفرعية (مع اسم الفئة الرئيسية)
  getAllSubGroups(): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any[]>(`${this.baseUrl}/api/SubGroup/getAllSubGroups`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب الفئات الفرعية:', error);
          return throwError(() => new Error('فشل جلب الفئات الفرعية'));
        })
      );
  }

  // جلب الفئات الفرعية لفئة رئيسية معينة
  getSubGroupsByGroup(groupId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any[]>(`${this.baseUrl}/api/SubGroup/by-group/${groupId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في جلب الفئات الفرعية للفئة ${groupId}:`, error);
          return throwError(() => new Error('فشل جلب الفئات الفرعية'));
        })
      );
  }

  // إضافة فئة فرعية جديدة
  addSubGroup(data: {
    arName: string;
    enName: string;
    groupId: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .post<any>(`${this.baseUrl}/api/SubGroup/addSubGroup`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في إضافة الفئة الفرعية:', error);
          return throwError(() => new Error('فشل إضافة الفئة الفرعية'));
        })
      );
  }

  // تعديل فئة فرعية
  updateSubGroup(data: {
    id: number;
    arName: string;
    enName: string;
    groupId: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .put<any>(`${this.baseUrl}/api/SubGroup/updateSubGroup`, data, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في تعديل الفئة الفرعية:', error);
          return throwError(() => new Error('فشل تعديل الفئة الفرعية'));
        })
      );
  }

  // حذف فئة فرعية
  deleteSubGroup(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .delete<string>(`${this.baseUrl}/api/SubGroup/deleteSubGroup?id=${id}`, {
        headers,
        responseType: 'text' as 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الفئة الفرعية ${id}:`, error);
          return throwError(() => new Error('فشل حذف الفئة الفرعية'));
        })
      );
  }

  /********************************Service*********************************************/

  // جلب كل الخدمات
  getAllServices(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Service/getAllServices`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب الخدمات:', error);
          return throwError(() => new Error('فشل جلب الخدمات'));
        })
      );
  }

  // إضافة فئة جديدة
  addServices(data: { arName: string; enName: string }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Service/addService`;
    return this.http.post<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('خطأ في إضافة الخدمة:', error);
        return throwError(() => new Error('فشل إضافة الخدمة'));
      })
    );
  }

  //مسح الفئة
  deleteServices(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Service/deleteService?id=${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الخدمة ${id}:`, error);
          return throwError(() => new Error(`فشل حذف الخدمة ${id}`));
        })
      );
  }

  // دالة تعديل الفئة
  updateServices(
    id: number,
    data: { id: number; arName: string; enName: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Service/updateService?id=${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في تعديل الخدمة ${id}:`, error);
        return throwError(() => new Error(`فشل تعديل الخدمة ${id}`));
      })
    );
  }

  /********************************Currencies*********************************************/

  // جلب كل العملات
  getAllCurrencies(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Currency/getAllCurrencies`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب العملات:', error);
          return throwError(() => new Error('فشل جلب العملات'));
        })
      );
  }

  // إضافة محافظة جديدة
  addCurrencies(data: { arName: string; enName: string }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Currency/addCurrency`;
    return this.http.post<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('خطأ في إضافة العملة:', error);
        return throwError(() => new Error('فشل إضافة العملة'));
      })
    );
  }

  //مسح العملة
  deleteCurrencies(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Currency/deleteCurrency?id=${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف العملة ${id}:`, error);
          return throwError(() => new Error(`فشل حذف العملة ${id}`));
        })
      );
  }

  // دالة تعديل العملة
  updateCurrencies(
    id: number,
    data: { id: number; arName: string; enName: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Currency/updateCurrency?id=${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في تعديل العملة ${id}:`, error);
        return throwError(() => new Error(`فشل تعديل العملة ${id}`));
      })
    );
  }

  /********************************Governorates*********************************************/
  // جلب كل المحافظات
  getAllGovernorates(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Governorate/getAllGovernorates`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب المحافظات:', error);
          return throwError(() => new Error('فشل جلب المحافظات'));
        })
      );
  }

  // إضافة محافظة جديدة
  addGovernorates(data: { arName: string; enName: string }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Governorate/addGovernorate`;
    return this.http.post<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error('خطأ في إضافة المحافظة:', error);
        return throwError(() => new Error('فشل إضافة المحافظة'));
      })
    );
  }

  //مسح المحافظة
  deleteGovernorates(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Governorate/deleteGovernorate?id=${id}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المحافظة ${id}:`, error);
          return throwError(() => new Error(`فشل حذف المحافظة ${id}`));
        })
      );
  }

  // دالة تعديل المحافظة
  updateGovernorates(
    id: number,
    data: { id: number; arName: string; enName: string }
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Governorate/updateGovernorate?id=${id}`;
    return this.http.put<any>(url, data, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في تعديل المحافظة ${id}:`, error);
        return throwError(() => new Error(`فشل تعديل المحافظة ${id}`));
      })
    );
  }

  /********************************** Areas - المناطق **********************************/

  // 1. جلب كل المناطق (مع governorateName)
  getAllAreas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any[]>(`${this.baseUrl}/api/Area/getAllAreas`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب كل المناطق:', error);
          return throwError(() => new Error('فشل جلب المناطق'));
        })
      );
  }

  // 2. جلب مناطق محافظة معينة فقط
  getAreasByGovernorate(governorateId: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any[]>(`${this.baseUrl}/api/Area/by-governorate/${governorateId}`, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في جلب مناطق المحافظة ${governorateId}:`, error);
          return throwError(() => new Error('فشل جلب المناطق'));
        })
      );
  }

  // 3. إضافة منطقة جديدة
  addArea(data: {
    arName: string;
    enName: string;
    governorateId: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .post<any>(`${this.baseUrl}/api/Area/addArea`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في إضافة المنطقة:', error);
          return throwError(() => new Error('فشل إضافة المنطقة'));
        })
      );
  }

  // 4. تعديل منطقة
  updateArea(data: {
    id: number;
    arName: string;
    enName: string;
    governorateId: number;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .put<any>(`${this.baseUrl}/api/Area/updateArea`, data, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في تعديل المنطقة:', error);
          return throwError(() => new Error('فشل تعديل المنطقة'));
        })
      );
  }

  // 5. حذف منطقة
  deleteArea(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .delete<string>(`${this.baseUrl}/api/Area/deleteArea?id=${id}`, {
        headers,
        responseType: 'text' as 'json',
      })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المنطقة ${id}:`, error);
          return throwError(() => new Error('فشل حذف المنطقة'));
        })
      );
  }

  /*******************************************advertisement****************************************************/
  // جلب كل الاعلانات
  getAllAdvertisement(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Advertisement/GetAll`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب كل الاعلانات:', error);
          return throwError(() => new Error('فشل جلب كل الاعلانات'));
        })
      );
  }

  // جلب الاعلانات حسب الفئة
  getAdvertisementByGroupId(groupId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/By-GroupId/${groupId}`;
    return this.http.get<any>(url, { headers }).pipe(
      map((response) => (Array.isArray(response) ? response : [])),
      catchError((error) => {
        console.error(`خطأ في جلب الإعلانات للفئة ${groupId}:`, error);
        return throwError(
          () => new Error(`فشل جلب الإعلانات للفئة ${groupId}`)
        );
      })
    );
  }

  // التحقق من الفئة
  checkGroupExists(groupId: number): Observable<boolean> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any[]>(`${this.baseUrl}/api/Group/getAllGroups`, { headers })
      .pipe(
        map((groups) => groups.some((group: any) => group.id === groupId)),
        catchError((error) => {
          console.error(`خطأ في التحقق من الفئة ${groupId}:`, error);
          return throwError(() => new Error(`فشل التحقق من الفئة ${groupId}`));
        })
      );
  }

  //بحث في الاعلان بالاسم
  searchByAdvertisementName(Name: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/By-Name/${Name}`;
    return this.http.get<any>(url, { headers }).pipe(
      map((response) => (Array.isArray(response) ? response : [])),
      catchError((error) => {
        console.error(`خطأ في البحث عن "${Name}":`, error);
        return throwError(() => new Error(`فشل البحث عن "${Name}"`));
      })
    );
  }

  //  جلب تفاصيل الإعلان
  getAdvertisementById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/By-Id/${id}`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في جلب الإعلان ${id}:`, error);
        return throwError(() => new Error(`فشل جلب الإعلان ${id}`));
      })
    );
  }

  //قبول الاعلان
  approveAdvertisement(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/Approval/${id}`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في قبول الإعلان ${id}:`, error);
          return throwError(() => new Error(`فشل قبول الإعلان ${id}`));
        })
      );
  }

  // استرجاع الاعلان
  restoreAdvertisement(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/RestoreAdvertisement/${id}`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في استرجاع الإعلان ${id}:`, error);
          return throwError(() => new Error(`فشل استرجاع الإعلان ${id}`));
        })
      );
  }

  //حذف الاعلان
  deleteAdvertisement(id: number, deletionReason: string): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/DeleteAdvertisement`;
    const body = { id, deletionReason };
    return this.http
      .put<string>(url, body, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الإعلان ${id}:`, error);
          return throwError(() => new Error(`فشل حذف الإعلان ${id}`));
        })
      );
  }

  // دالة لحذف صورة واحدة
  deleteImage(advertisementId: number, imageId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/${advertisementId}/DeleteImage/${imageId}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(
            `خطأ في حذف الصورة ${imageId} للإعلان ${advertisementId}:`,
            error
          );
          return throwError(() => new Error(`فشل حذف الصورة ${imageId}`));
        })
      );
  }

  // دالة لتعديل الإعلان
  updateAdvertisement(data: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/updateAdvertisement`;
    return this.http
      .put<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في تعديل الإعلان:`, error);
          return throwError(
            () =>
              new Error(
                `فشل تعديل الإعلان: ${error.message || 'خطأ غير معروف'}`
              )
          );
        })
      );
  }

  /**************************************************comments**********************************************************/

  // دالة جديدة لجلب الكومنتات حسب الاعلان
  getCommentAdvertisement(
    advertId: number,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/Comments/By-AdvertIdPaged/${advertId}?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error) => {
        console.error(`خطأ في جلب تعليقات الإعلان ${advertId}:`, error);
        return throwError(
          () => new Error(`فشل جلب تعليقات الإعلان ${advertId}`)
        );
      })
    );
  }

  //دالة لجلب كل بلاغات التعليقات
  getcommentReports(page: number = 1, pageSize: number = 10): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/getAllCommentReportsPaged?page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url, { headers }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error) => {
        console.error('خطأ في جلب كل التعليقات المبلغة:', error);
        return throwError(() => new Error('فشل جلب كل بلاغات التعليقات'));
      })
    );
  }

  approveCommentReport(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/ApprovalCommentReport/${id}`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في قبول الابلاغ ${id}:`, error);
          return throwError(() => new Error(`فشل قبول الابلاغ ${id}`));
        })
      );
  }

  deleteCommentReport(id: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Advertisement/DeleteCommentReport/${id}`;
    return this.http
      .put<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف الابلاغ ${id}:`, error);
          return throwError(() => new Error(`فشل حذف الابلاغ ${id}`));
        })
      );
  }

  /**********************************user*************************************************/
  // جلب كل المستخدمين
  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Member/getAllMembers`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب كل المستخدمين:', error);
          return throwError(() => new Error('فشل جلب كل المستخدمين'));
        })
      );
  }

  // البحث في المستخدمين
  searchMembers(
    keyword: string,
    page: number = 1,
    pageSize: number = 10
  ): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/searchMembers`;
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(url, { headers, params }).pipe(
      map(
        (response) =>
          response || {
            items: [],
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          }
      ),
      catchError((error) => {
        console.error(`خطأ في البحث عن "${keyword}":`, error);
        return throwError(() => new Error(`فشل البحث عن "${keyword}"`));
      })
    );
  }

  //حظر المستخدم
  DeactivateDeleteRelated(userId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/DeactivateDeleteRelated?userId=${userId}`;
    return this.http
      .post<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حظر المستخدم ${userId}:`, error);
          return throwError(() => new Error(`فشل حظر المستخدم ${userId}`));
        })
      );
  }

  DeactivateUser(userId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/DeactivateMemberOnly?userId=${userId}`;
    return this.http
      .post<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حظر المستخدم ${userId}:`, error);
          return throwError(() => new Error(`فشل حظر المستخدم ${userId}`));
        })
      );
  }

  activateUser(userId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/AdminActivateMember?userId=${userId}`;
    return this.http
      .post<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في تنشيط المستخدم ${userId}:`, error);
          return throwError(() => new Error(`فشل تنشيط المستخدم ${userId}`));
        })
      );
  }

  //حذف المستخدم
  deleteUser(userId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/delete?userId=${userId}`;
    return this.http
      .post<string>(url, {}, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف المستخدم ${userId}:`, error);
          return throwError(() => new Error(`فشل حذف المستخدم ${userId}`));
        })
      );
  }

  //  جلب تفاصيل المستخدم
  getUserById(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/profileById/${userId}`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => {
        console.error(`خطأ في جلب المستخدم ${userId}:`, error);
        return throwError(() => new Error(`فشل جلب المستخدم ${userId}`));
      })
    );
  }

  // دالة لتعديل المستخدم
  updateUser(data: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Member/adminUpdateMember`;
    return this.http
      .put<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في تعديل المستخدم:`, error);
          return throwError(
            () =>
              new Error(
                `فشل تعديل المستخدم: ${error.message || 'خطأ غير معروف'}`
              )
          );
        })
      );
  }

  // إضافة مستخد جديد
  adduser(data: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Member/adminAddMember`;
    return this.http
      .post<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'حدث خطأ غير معروف';
          if (error.status === 0) {
            errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
          } else if (error.status === 401) {
            errorMessage = 'غير مصرح لك بإضافة مستخدم.';
          } else if (error.status === 409) {
            errorMessage = 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل.';
          } else if (error.status === 503) {
            errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
          }
          console.error('خطأ في إضافة المستخدم:', error);
          return throwError(() => ({
            status: error.status,
            message: errorMessage,
          }));
        })
      );
  }

  /*****************************my profile**************************************/

  // جلب بيانات حسابي
  getMyProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Member/profile`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب حسابي:', error);
          return throwError(() => new Error('فشل جلب حسابي'));
        })
      );
  }

  // تحديث كلمة المرور
  updatePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Member/updatePassword`;
    return this.http
      .post<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'حدث خطأ غير معروف';
          if (error.status === 0) {
            errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
          } else if (error.status === 401) {
            errorMessage = 'كلمة المرور القديمة غير صحيحة.';
          } else if (error.status === 503) {
            errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
          }
          console.error('خطأ في تحديث كلمة المرور:', error);
          return throwError(() => ({
            status: error.status,
            message: errorMessage,
          }));
        })
      );
  }

  // تحديث الملف الشخصي
  updateProfile(data: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Member/updateProfile`;
    return this.http
      .put<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'حدث خطأ غير معروف';
          if (error.status === 0) {
            errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
          } else if (error.status === 401) {
            errorMessage = 'غير مصرح لك بتعديل الملف الشخصي.';
          } else if (error.status === 409) {
            errorMessage = 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل.';
          } else if (error.status === 503) {
            errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
          }
          console.error('خطأ في تحديث الملف الشخصي:', error);
          return throwError(() => ({
            status: error.status,
            message: errorMessage,
          }));
        })
      );
  }

  /**********************************slider*********************************************/
  // جلب كل البانرات
  getAllSliders(): Observable<any> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return this.http
      .get<any>(`${this.baseUrl}/api/Slider/getAll`, { headers })
      .pipe(
        catchError((error) => {
          console.error('خطأ في جلب كل البانرات:', error);
          return throwError(() => new Error('فشل جلب كل البانرات'));
        })
      );
  }

  //حذف البانر
  deleteSlider(sliderId: number): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
    }
    const url = `${this.baseUrl}/api/Slider/delete?id=${sliderId}`;
    return this.http
      .delete<string>(url, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          console.error(`خطأ في حذف البانر ${sliderId}:`, error);
          return throwError(() => new Error(`فشل حذف البانر ${sliderId}`));
        })
      );
  }

  // إضافة بانر جديد
  addslider(data: FormData): Observable<string> {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const url = `${this.baseUrl}/api/Slider/create`;
    return this.http
      .post<string>(url, data, { headers, responseType: 'text' as 'json' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'حدث خطأ غير معروف';
          if (error.status === 0) {
            errorMessage = 'فشل الاتصال بالخادم. تحقق من الشبكة.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'بيانات الإدخال غير صحيحة.';
          } else if (error.status === 401) {
            errorMessage = 'غير مصرح لك بإضافة بانر.';
          } else if (error.status === 503) {
            errorMessage = 'الخادم غير متاح حاليًا. حاول لاحقًا.';
          }
          console.error('خطأ في إضافة البانر:', error);
          return throwError(() => ({
            status: error.status,
            message: errorMessage,
          }));
        })
      );
  }
}

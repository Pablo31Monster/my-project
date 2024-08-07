import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Book } from '../../../../shared/models/book';

@Injectable({
  providedIn: 'root'
})
export class CreateService {
  private apiUrl = environment.apiUrl + '/admin/book-create/';

  constructor(
    private http: HttpClient,
  ){ }

  create(data: FormData): Observable<void>{
    return this.http.post<void>(this.apiUrl, data);
  }
}

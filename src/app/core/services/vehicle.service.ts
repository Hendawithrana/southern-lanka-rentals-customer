import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { VehicleDetail, VehicleSummary } from '../models/vehicle.model';
import { PagedResult, VehicleSearchParams } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) {}

  search(params: VehicleSearchParams): Observable<PagedResult<VehicleSummary>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      // `false` is the "no filter" state for boolean params (e.g. deliveryOnly) -
      // omit it rather than sending the literal string "false", which the API's
      // strict boolean validation rejects.
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<PagedResult<VehicleSummary>>(`${API_BASE_URL}/search/vehicles`, { params: httpParams });
  }

  getBySlug(slug: string): Observable<VehicleDetail> {
    return this.http.get<VehicleDetail>(`${API_BASE_URL}/vehicles/${slug}`);
  }
}

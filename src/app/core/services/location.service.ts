import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Location } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  constructor(private http: HttpClient) {}

  listActive(): Observable<Location[]> {
    return this.http.get<Location[]>(`${API_BASE_URL}/locations`);
  }
}

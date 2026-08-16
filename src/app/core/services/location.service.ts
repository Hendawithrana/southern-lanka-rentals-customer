import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from './api-config';
import { Location } from '../models/location.model';

interface LocationsResponse {
  data: Location[];
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  constructor(private http: HttpClient) {}

  listActive(): Observable<Location[]> {
    return this.http
      .get<LocationsResponse>(`${API_BASE_URL}/locations`)
      .pipe(map((response) => response.data));
  }
}

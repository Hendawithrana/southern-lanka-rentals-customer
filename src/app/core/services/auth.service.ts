import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { AuthResponse, LoginRequest, RegisterRequest, Role } from '../models/auth.model';

const TOKEN_KEY = 'slr_access_token';
const ROLE_KEY = 'slr_role';
const NAME_KEY = 'slr_full_name';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private roleSignal = signal<Role | null>(localStorage.getItem(ROLE_KEY) as Role | null);
  private fullNameSignal = signal<string | null>(localStorage.getItem(NAME_KEY));

  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly role = computed(() => this.roleSignal());
  readonly fullName = computed(() => this.fullNameSignal());

  constructor(private http: HttpClient) {}

  registerCustomer(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register/customer`, req)
      .pipe(tap((res) => this.persistSession(res)));
  }

  registerVendor(req: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/register/vendor`, req)
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, req)
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(NAME_KEY);
    this.tokenSignal.set(null);
    this.roleSignal.set(null);
    this.fullNameSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private persistSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    if (res.role) localStorage.setItem(ROLE_KEY, res.role);
    if (res.fullName) localStorage.setItem(NAME_KEY, res.fullName);
    this.tokenSignal.set(res.accessToken);
    this.roleSignal.set(res.role);
    this.fullNameSignal.set(res.fullName);
  }
}

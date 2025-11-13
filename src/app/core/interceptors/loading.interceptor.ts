// src/app/core/interceptors/loading.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading spinner when a request starts
    this.loadingService.show();

    return next.handle(req).pipe(
      finalize(() => {
        // Hide spinner after the request completes (success or error)
        this.loadingService.hide();
      })
    );
  }
}

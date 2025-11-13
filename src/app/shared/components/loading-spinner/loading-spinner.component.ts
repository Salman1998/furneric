// src/app/shared/components/loading-spinner/loading-spinner.component.ts
import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.loading$ | async) {
      <div class="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-40 z-50">
        <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    }
  `,
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}

import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {

constructor(public toast: ToastService) {}

  getClasses(type: string) {
    return {
      success: 'bg-green-600 text-white',
      error: 'bg-red-600 text-white',
      warning: 'bg-yellow-600 text-gray-900',
      info: 'bg-blue-600 text-white',
    }[type];
  }

  remove(id: number) {
    this.toast.remove(id);
  }
}
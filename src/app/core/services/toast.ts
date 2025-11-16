import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private counter = 0;

  show(text: string, type: ToastType = 'info', duration: number = 4000) {
    const toast: ToastMessage = {
      id: this.counter++,
      text,
      type,
    };

    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, toast]);

    // Auto remove toast
    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: number) {
    const updated = this.messagesSubject.value.filter(t => t.id !== id);
    this.messagesSubject.next(updated);
  }
}

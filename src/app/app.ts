import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, Injector, runInInjectionContext } from '@angular/core';
import { DataService } from './data.service';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, CommonModule, LoadingSpinnerComponent, ToastContainer ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
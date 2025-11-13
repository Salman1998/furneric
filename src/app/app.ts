import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, Injector, runInInjectionContext } from '@angular/core';
import { DataService } from './data.service';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, CommonModule, LoadingSpinnerComponent ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
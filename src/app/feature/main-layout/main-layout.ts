import { Component, Renderer2 } from '@angular/core';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, Header, Footer, Sidebar ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
isSidebarOpen = false;
  isDiscoverOpen = false;
  isProductTypeOpen = false;
  selectedSpace: string | null = null;
  selectedCategory: string | null = null;

  constructor(
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // this.setupScrollHandling();
    this.setInitialStyles();
  }

  private setInitialStyles(): void {
    // Set body styles programmatically
    this.renderer.setStyle(document.body, 'margin', '0');
    this.renderer.setStyle(document.body, 'padding', '0');
    this.renderer.setStyle(document.body, 'overflowX', 'hidden');
    
    // Add header space
    this.renderer.setStyle(document.body, 'paddingTop', '16px');
  }
}

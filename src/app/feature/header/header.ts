import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface NavLink {
  label: string;
  link: string;
}

interface NavIcon {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  searchTerm: string = '';
  isMenuOpen: boolean = false;
  isMobileSearchOpen: boolean = false;
  isScrolled: boolean = false;

  navLinks: NavLink[] = [
    { label: 'Home', link: '/' },
    { label: 'Customize', link: '/customize' },
    { label: 'My Library', link: '/my-library' },
    { label: 'Contact', link: '/contact' }
  ];

  navIcons: NavIcon[] = [
    { label: 'Likes', link: '/liked', icon: 'fas fa-heart' },
    { label: 'Globe', link: '/globe', icon: 'fas fa-globe' },
    { label: 'Cart', link: '/cart', icon: 'fas fa-shopping-cart' },
    { label: 'Profile', link: '/profile', icon: 'fas fa-user' }
  ];

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(event: Event) {
    event.preventDefault();
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  toggleMobileSearch(event: Event) {
    event.preventDefault();
    this.isMobileSearchOpen = !this.isMobileSearchOpen;
  }

  handleMenuItemClick(event: Event) {
    event.preventDefault();
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = 'auto';
    }
    if (this.isMobileSearchOpen) {
      this.isMobileSearchOpen = false;
    }
  }

  handleBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.toggleMenu(event);
    }
  }
}

import { Component, inject } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HeroBanner } from './hero-banner/hero-banner';
import { Categories } from './categories/categories';
import { ProductList } from './product-list/product-list';

@Component({
  selector: 'app-home',
  imports: [HeroBanner, Categories, ProductList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private auth = inject(AuthService);
  private router = inject(Router);


  logout() {
    this.auth.logout();
  }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {

  categories = [
    { title: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop" },
    { title: "Fashion", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop" },
    { title: "Home", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop" },
    { title: "Sports", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop" },
    { title: "Books", img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop" },
    { title: "Toys", img: "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=200&h=200&fit=crop" },
    { title: "Beauty", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop" },
    { title: "Garden", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
  ];

  imageErrors: Record<string, boolean> = {};

  constructor(private router: Router) {}

  onSelectCategory(title: string) {
    this.router.navigate([`/${title}`]);
  }

  onImageError(category: any) {
    this.imageErrors[category.title] = true;
  }
}
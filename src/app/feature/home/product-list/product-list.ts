import { Component, ElementRef, HostListener, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';  // ✅ REQUIRED

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  numRating: number;
  category: string;
}

interface ProductCategoryState {
  title: string;
  allItems: Product[];
  visibleItems: Product[]; // used for desktop grid pagination
  currentIndex: number; // pagination index for desktop; for mobile it's slide index
  itemsPerPage: number;
}
@Component({
  selector: 'app-product-list',
  imports: [DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
    sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 2999,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.5,
      numRating: 128,
      category: 'Electronics',
    },
    {
      id: '2',
      name: 'Smart Watch Series 7',
      price: 3999,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.8,
      numRating: 256,
      category: 'Electronics',
    },
    {
      id: '3',
      name: 'Designer Leather Wallet',
      price: 1299,
      image:
        'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop',
      rating: 4.3,
      numRating: 89,
      category: 'Fashion',
    },
    {
      id: '4',
      name: 'Classic Denim Jacket',
      price: 2499,
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      rating: 4.6,
      numRating: 145,
      category: 'Fashion',
    },
    {
      id: '5',
      name: 'Modern Table Lamp',
      price: 1899,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.4,
      numRating: 72,
      category: 'Home',
    },
    {
      id: '6',
      name: 'Ceramic Vase Set',
      price: 999,
      image:
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
      rating: 4.2,
      numRating: 56,
      category: 'Home',
    },
    {
      id: '5',
      name: 'Modern Table Lamp',
      price: 1899,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.4,
      numRating: 72,
      category: 'Home',
    },
    {
      id: '6',
      name: 'Ceramic Vase Set',
      price: 999,
      image:
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
      rating: 4.2,
      numRating: 56,
      category: 'Home',
    },
    {
      id: '5',
      name: 'Modern Table Lamp',
      price: 1899,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.4,
      numRating: 72,
      category: 'Home',
    },
    {
      id: '6',
      name: 'Ceramic Vase Set',
      price: 999,
      image:
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
      rating: 4.2,
      numRating: 56,
      category: 'Home',
    },
    {
      id: '5',
      name: 'Modern Table Lamp',
      price: 1899,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.4,
      numRating: 72,
      category: 'Home',
    },
    {
      id: '6',
      name: 'Ceramic Vase Set',
      price: 999,
      image:
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
      rating: 4.2,
      numRating: 56,
      category: 'Home',
    },
    {
      id: '5',
      name: 'Modern Table Lamp',
      price: 1899,
      image:
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      rating: 4.4,
      numRating: 72,
      category: 'Home',
    },
    {
      id: '6',
      name: 'Ceramic Vase Set',
      price: 999,
      image:
        'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop',
      rating: 4.2,
      numRating: 56,
      category: 'Home',
    },
  ];

  categories: ProductCategoryState[] = [];

  // references to mobile carousel tracks (one track per category)
  @ViewChildren('track') tracks!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('container', { read: ElementRef, static: false })
  containerRef!: ElementRef<HTMLDivElement>;

  // For touch handling per-category
  private touchStartX = 0;
  private touchEndX = 0;
  private swipeThreshold = 40; // px

  // store measured card width for each track (index aligned with categories)
  cardWidths: number[] = [];

  constructor(private router: Router, private hostRef: ElementRef) {}

  ngOnInit(): void {
    // Group products by category
    const grouped = this.sampleProducts.reduce((acc: Record<string, Product[]>, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {});

    // Create category states
    this.categories = Object.entries(grouped).map(([title, items]) => {
      const itemsPerPage = 5; // desktop default
      return {
        title,
        allItems: items,
        visibleItems: items.slice(0, itemsPerPage),
        currentIndex: 0,
        itemsPerPage,
      };
    });
  }

  ngAfterViewInit(): void {
    // Wait a tick then measure card width for each track (mobile)
    setTimeout(() => {
      this.tracks.forEach((trackRef, idx) => {
        const track = trackRef.nativeElement;
        const firstCard = track.querySelector('.carousel-card') as HTMLElement | null;
        const gapStyle = getComputedStyle(track).gap || '0px';
        const gap = parseFloat(gapStyle) || 0;
        const width = firstCard ? firstCard.offsetWidth + gap : 280 + gap; // fallback
        this.cardWidths[idx] = width;
        // ensure transform is correct (initial)
        this.updateTrackTransform(idx);
      });
    }, 50);
  }

  // Desktop pagination
  handleNextDesktop(categoryIndex: number) {
    const cat = this.categories[categoryIndex];
    const maxIndex = Math.max(cat.allItems.length - cat.itemsPerPage, 0);
    const newIndex = Math.min(cat.currentIndex + 1, maxIndex);
    cat.currentIndex = newIndex;
    cat.visibleItems = cat.allItems.slice(newIndex, newIndex + cat.itemsPerPage);
  }

  handlePrevDesktop(categoryIndex: number) {
    const cat = this.categories[categoryIndex];
    const newIndex = Math.max(cat.currentIndex - 1, 0);
    cat.currentIndex = newIndex;
    cat.visibleItems = cat.allItems.slice(newIndex, newIndex + cat.itemsPerPage);
  }

  isPrevDisabledDesktop(categoryIndex: number) {
    return this.categories[categoryIndex].currentIndex === 0;
  }

  isNextDisabledDesktop(categoryIndex: number) {
    const cat = this.categories[categoryIndex];
    return cat.currentIndex >= cat.allItems.length - cat.itemsPerPage;
  }

  // Mobile carousel next/prev (per category index)
  handleNextMobile(categoryIndex: number) {
    const cat = this.categories[categoryIndex];
    const maxIndex = Math.max(cat.allItems.length - 1, 0);
    if (cat.currentIndex < maxIndex) {
      cat.currentIndex++;
      this.updateTrackTransform(categoryIndex);
    }
  }

  handlePrevMobile(categoryIndex: number) {
    const cat = this.categories[categoryIndex];
    if (cat.currentIndex > 0) {
      cat.currentIndex--;
      this.updateTrackTransform(categoryIndex);
    }
  }

  updateTrackTransform(categoryIndex: number) {
    const trackEl = this.tracks.toArray()[categoryIndex]?.nativeElement;
    const width = this.cardWidths[categoryIndex] ?? 0;
    if (!trackEl) return;
    const translateX = -(this.categories[categoryIndex].currentIndex * width);
    trackEl.style.transform = `translateX(${translateX}px)`;
    trackEl.style.transition = 'transform 400ms ease';
  }

  // Touch handlers attached to mobile containers in template
  onTouchStart(ev: TouchEvent) {
    this.touchStartX = ev.touches[0].clientX;
  }

  onTouchEnd(ev: TouchEvent, categoryIndex: number) {
    this.touchEndX = ev.changedTouches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > this.swipeThreshold) {
      if (diff > 0) {
        // swipe left -> next
        this.handleNextMobile(categoryIndex);
      } else {
        // swipe right -> prev
        this.handlePrevMobile(categoryIndex);
      }
    }
  }

  // Navigate to category or product (router navigation)
  goToCategory(title: string) {
    // mimic original: navigate to /{title}
    this.router.navigate([`/${title}`]);
  }

  goToProduct(product: Product) {
    // mimic original: /{category}/{id}/{name}
    const slug = encodeURIComponent(product.name);
    this.router.navigate([`/${product.category}/${product.id}/${slug}`]);
  }

  // recompute widths on resize
  @HostListener('window:resize')
  onResize() {
    setTimeout(() => {
      this.tracks.forEach((trackRef, idx) => {
        const track = trackRef.nativeElement;
        const firstCard = track.querySelector('.carousel-card') as HTMLElement | null;
        const gapStyle = getComputedStyle(track).gap || '0px';
        const gap = parseFloat(gapStyle) || 0;
        const width = firstCard ? firstCard.offsetWidth + gap : 280 + gap;
        this.cardWidths[idx] = width;
        this.updateTrackTransform(idx);
      });
    }, 80);
  }
}
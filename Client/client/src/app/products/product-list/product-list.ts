import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <h2>Products</h2>

    @if (loading()) {
      <p>Loading products...</p>
    } @else if (error()) {
      <p class="error">Something went wrong. Please try again later.</p>
    } @else if (products().length === 0) {
      <p>No products available.</p>
    } @else {
      <div class="product-grid">
        @for (item of products(); track item.id) {
          <app-product-card
            [product]="item"
            (addToCart)="onAddToCart($event)"
            (deleteProduct)="onDeleteProduct($event)" />
        }
      </div>
    }
  `,
  styles: [`
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; padding: 1rem 0; }
    .error { color: red; }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  onDeleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: () => alert('Failed to delete product.')
      });
    }
  }
}

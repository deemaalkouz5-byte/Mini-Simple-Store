import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card">
      <img [src]="product().imageUrl || 'https://via.placeholder.com/150'" [alt]="product().name">
      <h3>{{ product().name }}</h3>
      <p>{{ product().description }}</p>
      <div class="price">{{ product().price }} JD</div>
      <div class="actions">
        <button (click)="addToCart.emit(product())" class="btn-add">Add to Cart</button>
        <a [routerLink]="['/products', product().id, 'edit']" class="btn-edit">Edit</a>
        <button (click)="deleteProduct.emit(product().id)" class="btn-delete">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between; }
    .card img { width: 100%; height: 150px; object-fit: cover; }
    .price { font-size: 1.2rem; font-weight: bold; margin: 0.5rem 0; color: #2e7d32; }
    .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem; }
    button, a { padding: 0.5rem; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; text-align: center; }
    .btn-add { background-color: #007bff; color: white; }
    .btn-edit { background-color: #ffc107; color: black; }
    .btn-delete { background-color: #dc3545; color: white; }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
  deleteProduct = output<number>();
}

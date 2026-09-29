import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Your Cart</h2>

    @if (cartService.cartItems().length === 0) {
      <p>Your cart is empty.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          @for (item of cartService.cartItems(); track item.product.id) {
            <tr>
              <td>{{ item.product.name }}</td>
              <td>{{ item.product.price }} JD</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.product.price * item.quantity }} JD</td>
              <td>
                <button (click)="cartService.removeFromCart(item.product.id)">Remove</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <div class="cart-summary">
        <h3>Total: {{ cartService.totalAmount() }} JD</h3>
        <a routerLink="/checkout" class="btn-checkout">Proceed to Checkout</a>
      </div>
    }
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    .cart-summary { display: flex; justify-content: space-between; align-items: center; }
    .btn-checkout { padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
}

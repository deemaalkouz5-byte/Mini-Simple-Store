import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2>Checkout</h2>

    @if (successMessage()) {
      <div class="success-box">
        <p>{{ successMessage() }}</p>
      </div>
    } @else if (cartService.cartItems().length === 0) {
      <p>Your cart is empty. Please add items before checking out.</p>
    } @else {
      <div class="checkout-container">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <h3>Customer Details</h3>

          <div class="form-group">
            <label>Customer Name</label>
            <input formControlName="customerName" type="text" />
            @if (form.get('customerName')?.touched && form.get('customerName')?.invalid) {
              <span class="error">Customer Name is required.</span>
            }
          </div>

          <div class="form-group">
            <label>Phone</label>
            <input formControlName="phone" type="text" />
            @if (form.get('phone')?.touched && form.get('phone')?.invalid) {
              <span class="error">Phone is required.</span>
            }
          </div>

          <div class="form-group">
            <label>Address</label>
            <textarea formControlName="address"></textarea>
            @if (form.get('address')?.touched && form.get('address')?.invalid) {
              <span class="error">Address is required.</span>
            }
          </div>

          <button type="submit" [disabled]="form.invalid">Place Order</button>
        </form>

        <div class="order-summary">
          <h3>Order Summary</h3>
          <ul>
            @for (item of cartService.cartItems(); track item.product.id) {
              <li>{{ item.product.name }} × {{ item.quantity }} - {{ item.product.price * item.quantity }} JD</li>
            }
          </ul>
          <h4>Total: {{ cartService.totalAmount() }} JD</h4>
        </div>
      </div>
    }
  `,
  styles: [`
    .checkout-container { display: flex; gap: 2rem; }
    form { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
    .order-summary { flex: 1; border: 1px solid #ccc; padding: 1rem; border-radius: 8px; }
    .form-group { display: flex; flex-direction: column; }
    .error { color: red; font-size: 0.8rem; }
    button { padding: 0.75rem; background: #28a745; color: white; border: none; cursor: pointer; }
    button:disabled { background: #ccc; }
    .success-box { padding: 1rem; background-color: #d4edda; color: #155724; border-radius: 4px; text-align: center; }
  `]
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  public cartService = inject(CartService);
  private orderService = inject(OrderService);

  successMessage = signal<string | null>(null);

  form = this.fb.group({
    customerName: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid || this.cartService.cartItems().length === 0) return;

    const request = {
      customerName: this.form.value.customerName!,
      phone: this.form.value.phone!,
      address: this.form.value.address!,
      items: this.cartService.cartItems().map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(request).subscribe({
      next: (res) => {
        this.successMessage.set(`Order created successfully! Order ID: ${res.orderId}. Total Amount: ${res.totalAmount} JD.`);
        this.cartService.clearCart();
      },
      error: () => alert('Failed to place order.')
    });
  }
}

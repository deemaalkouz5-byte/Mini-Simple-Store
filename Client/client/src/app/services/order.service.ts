/*import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal لإدارة عناصر السلة
  cartItems = signal<CartItem[]>([]);

  // Computed Signal لحساب السعر الإجمالي تلقائياً
  totalAmount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  // Computed Signal لحساب عدد العناصر الكلي في السلة (لإظهاره في الـ Navbar)
  cartCount = computed(() =>
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  // إضافة منتج للسلة
  addToCart(product: Product): void {
    const currentItems = this.cartItems();
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      const updated = [...currentItems];
      updated[existingIndex].quantity += 1;
      this.cartItems.set(updated);
    } else {
      this.cartItems.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  // حذف منتج من السلة
  removeFromCart(productId: number): void {
    this.cartItems.set(this.cartItems().filter(item => item.product.id !== productId));
  }

  // تفريغ السلة بعد إتمام الطلب
  clearCart(): void {
    this.cartItems.set([]);
  }
}*/
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5106/api/orders';

  createOrder(order: CreateOrderRequest): Observable<{ orderId: number; totalAmount: number }> {
    return this.http.post<{ orderId: number; totalAmount: number }>(this.apiUrl, order);
  }
}

/*import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  cartService = inject(CartService);
}*/
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="brand">Mini Store</div>
      <div class="links">
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/products/new" routerLinkActive="active">Add Product</a>
        <a routerLink="/cart" routerLinkActive="active">Cart ({{ cartService.itemCount() }})</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #333; color: white; }
    .brand { font-size: 1.5rem; font-weight: bold; }
    .links a { color: white; text-decoration: none; margin-left: 1.5rem; }
    .links a.active { font-weight: bold; text-decoration: underline; }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
}

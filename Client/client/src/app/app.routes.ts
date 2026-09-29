/*import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list';
import { ProductFormComponent } from './products/product-form/product-form';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: 'products' }
];*/
import { Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list';
import { ProductFormComponent } from './products/product-form/product-form';
import { CartComponent } from './cart/cart';
import { CheckoutComponent } from './checkout/checkout';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: '**', redirectTo: 'products' }
];

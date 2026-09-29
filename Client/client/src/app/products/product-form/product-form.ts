import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2>{{ isEditMode() ? 'Edit Product' : 'Create Product' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label>Name</label>
        <input formControlName="name" type="text" />
        @if (form.get('name')?.touched && form.get('name')?.invalid) {
          <span class="error">Name is required.</span>
        }
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea formControlName="description"></textarea>
        @if (form.get('description')?.touched && form.get('description')?.invalid) {
          <span class="error">Description is required.</span>
        }
      </div>

      <div class="form-group">
        <label>Price (JD)</label>
        <input formControlName="price" type="number" step="0.01" />
        @if (form.get('price')?.touched && form.get('price')?.invalid) {
          <span class="error">Price must be greater than zero.</span>
        }
      </div>

      <div class="form-group">
        <label>Image URL</label>
        <input formControlName="imageUrl" type="text" />
      </div>

      <button type="submit" [disabled]="form.invalid">{{ isEditMode() ? 'Update' : 'Create' }}</button>
    </form>
  `,
  styles: [`
    form { max-width: 400px; display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; }
    .error { color: red; font-size: 0.8rem; }
    button { padding: 0.5rem; background: #28a745; color: white; border: none; cursor: pointer; }
    button:disabled { background: #ccc; }
  `]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    imageUrl: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.productService.getProduct(+id).subscribe(product => {
        this.form.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const dto = this.form.value as any;

    if (this.isEditMode()) {
      this.productService.updateProduct(this.productId()!, dto).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.createProduct(dto).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}

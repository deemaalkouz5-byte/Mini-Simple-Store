# QA TEST REPORT

**Student Name:** [Enter your name here]  
**Project Name:** MiniStore (Full-Stack E-Commerce Application)  
**Date:** September 26, 2026  

---

## 1. Project Overview

**MiniStore** is a full-stack e-commerce web application built to provide a complete shopping experience. It allows customers to browse a catalog of products, view product details, manage items in a dynamic shopping cart with real-time price calculations, and complete purchases through a checkout system. On the administrative side, it supports full CRUD operations (Create, Read, Update, Delete) on products. 

The main features tested include:
- **Product Catalog:** Fetching and displaying products from the database with live images and pricing.
- **Product Management (CRUD):** Adding new products with validation, editing existing product information, and deleting products.
- **Shopping Cart:** Adding items to cart, dynamic total and quantity tracking using Angular Signals, and item removal.
- **Checkout & Orders:** Placing orders with customer details and item lists, calculating totals, and persisting orders to the database.

---

## 2. Testing Environment

| Component | Technology / Value |
| :--- | :--- |
| **Backend** | ASP.NET Core 10 Web API (C#) |
| **Frontend** | Angular 22 (Standalone Components, Signals) |
| **Database** | PostgreSQL (Entity Framework Core) |
| **API Tool** | Swagger / OpenAPI / Browser DevTools (Network tab) |
| **Browser** | Google Chrome (Latest Version) |
| **Environment** | Local Development (`http://localhost:4200` & `http://localhost:5106`) |

---

## 3. Test Cases

| TC ID | Feature | Test Scenario | Preconditions | Test Data | Test Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Product Catalog | Verify all products from the database are loaded and displayed in the catalog | Backend (port 5106) and Frontend (port 4200) running; products seeded in PostgreSQL | N/A | 1. Open `http://localhost:4200/products`<br>2. Observe the product grid | All products are fetched via `GET /api/products` and displayed with image, name, description, and price (JD). | All 3 seeded products loaded and rendered with image, title, and price. | **Pass** |
| **TC-02** | Product Management | Verify creating a new product with valid data | User navigated to `/products/new` | Name: "USB-C Hub"<br>Description: "7-in-1 multi-port adapter"<br>Price: 35.00<br>ImageUrl: "https://images.unsplash.com/..." | 1. Click "Add Product" in navbar.<br>2. Fill in all fields.<br>3. Click "Create". | `POST /api/products` returns 201 Created; user is redirected to `/products`; new product appears in catalog. | Product created successfully in PostgreSQL and displayed in catalog. | **Pass** |
| **TC-03** | Form Validation | Verify validation prevents submitting empty fields or invalid price | User is on Add Product form (`/products/new`) | Name: `""`<br>Description: `""`<br>Price: `0` | 1. Touch Name field and leave empty.<br>2. Enter price `0`.<br>3. Check button status and validation messages. | Error messages appear ("Name is required", "Price must be greater than zero"); Submit button is disabled. | Validation messages displayed correctly; "Create" button disabled. | **Pass** |
| **TC-04** | Product Management | Verify editing an existing product updates the record | Product exists in database (ID: 1) | Updated Price: `22.00` | 1. Click "Edit" on Wireless Mouse card.<br>2. Change price from 25 to 22.<br>3. Click "Update". | `PUT /api/products/1` returns 204 NoContent; product list updates with new price 22 JD. | Price updated successfully in database and UI reflects 22 JD. | **Pass** |
| **TC-05** | Product Management | Verify deleting a product removes it after user confirmation | At least one product exists in catalog | Click "Delete" on target product | 1. Click "Delete" button.<br>2. Click "OK" on confirmation alert. | `DELETE /api/products/{id}` executes; product is removed from database and UI. | Product deleted successfully and list automatically refreshed. | **Pass** |
| **TC-06** | Shopping Cart | Verify adding products to cart updates badge counter and recalculates total | User is on product list; Cart is empty (0) | Product 1 (25 JD) + Product 2 (50 JD) | 1. Click "Add to Cart" on Product 1.<br>2. Click "Add to Cart" on Product 2.<br>3. Check navbar.<br>4. Navigate to `/cart`. | Navbar updates to `Cart (2)`; Cart page shows both items with subtotal and Total = 75 JD. | Navbar shows `Cart (2)`; Cart page accurately lists items and total 75 JD. | **Pass** |
| **TC-07** | Shopping Cart | Verify removing an item from the cart recalculates count and total | Cart contains 2 items | Click "Remove" on Product 1 | 1. Go to `/cart`.<br>2. Click "Remove" button next to Product 1. | Product 1 is removed from table; Cart counter decreases to 1; Total updates to 50 JD. | Item removed; navbar counter decremented; total recalculated accurately. | **Pass** |
| **TC-08** | Checkout & Order | Verify placing an order with valid customer details | Cart contains at least 1 item; user on `/checkout` | CustomerName: "Ahmad Saleh"<br>Phone: "0791234567"<br>Address: "Amman, Jordan" | 1. Fill customer details.<br>2. Click "Place Order".<br>3. Verify feedback and cart state. | `POST /api/orders` returns 201 with Order ID; confirmation message shown; cart is cleared to 0. | Order stored in database with generated Order ID; success message displayed; cart cleared. | **Pass** |

---

## 4. Bug Reports

### BUG-01
- **Title:** Frontend unable to fetch products due to missing `ProductsController` and port mismatch
- **Severity:** Critical
- **Environment:** Local Development (`http://localhost:4200` & `http://localhost:5106`)
- **Status:** Fixed
- **Steps to Reproduce:**
  1. Start backend and frontend.
  2. Open `http://localhost:4200/products` in browser.
  3. Observe the product list component.
- **Expected Result:** Products are fetched via HTTP GET and rendered on the screen.
- **Actual Result / Evidence:** 
  The UI showed the error message: *"Something went wrong. Please try again later."* 
  Browser console showed HTTP 404 / Connection Refused because:
  - Angular was configured to call port `5000` while backend was hosted on port `5106`.
  - Backend only had `OrdersController`; `ProductsController` was missing.
- **Resolution:**
  - Created [`ProductsController.cs`](file:///d:/full%20stack/Ministore/Server/Ministore/Controllers/ProductsController.cs) in ASP.NET Core with all CRUD endpoints.
  - Updated `apiUrl` in [`product.service.ts`](file:///d:/full%20stack/Ministore/Client/client/src/app/services/product.service.ts) to `http://localhost:5106/api/products`.
  - Fixed CORS configuration in `Program.cs` to allow `http://localhost:4200`.

---

### BUG-02
- **Title:** Angular runtime crash `RuntimeError: NG0908: In this configuration Angular requires Zone.js`
- **Severity:** High
- **Environment:** Browser Runtime (Google Chrome) / Angular 22
- **Status:** Fixed
- **Steps to Reproduce:**
  1. Run `ng serve` and open `http://localhost:4200/`.
  2. Inspect the browser console.
- **Expected Result:** Angular application bootstraps cleanly without errors.
- **Actual Result / Evidence:** 
  Application crashed on startup with console error:
  `RuntimeError: NG0908: In this configuration Angular requires Zone.js at new NgZone`
- **Resolution:**
  In [`app.config.ts`](file:///d:/full%20stack/Ministore/Client/client/src/app/app.config.ts), replaced `provideZoneChangeDetection({ eventCoalescing: true })` with `provideZonelessChangeDetection()` matching Angular 22's default zoneless architecture.

---

## 5. Test Execution Summary

| Metric | Count |
| :--- | :---: |
| **TOTAL TEST CASES** | **8** |
| **PASSED** | **8** |
| **FAILED** | **0** |

---

## 6. Evidence / Screenshots

| Evidence Item | Description / What was verified |
| :--- | :--- |
| **Screenshot 1** | **Product Catalog Page (`/products`):** Displays seeded products with high-resolution images, titles, descriptions, prices in JD, and action buttons (Add to Cart, Edit, Delete). |
| **Screenshot 2** | **Add / Edit Product Form (`/products/new`):** Validated inputs for Name, Description, Price, and Image URL with disabled submit button when invalid. |
| **Screenshot 3** | **Shopping Cart Page (`/cart`):** Table showing selected products, item quantities, price subtotals, and dynamically computed total amount. |
| **Screenshot 4** | **Checkout Page & Order Success (`/checkout`):** Customer details form with order summary and order confirmation message displaying generated Order ID and total amount. |

---

## 7. Conclusion

Comprehensive testing was conducted on the **MiniStore** full-stack application covering frontend UI components, client-side state management (Angular Signals), RESTful API endpoints (ASP.NET Core), and database persistence (PostgreSQL with Entity Framework Core).

All **8 test cases** passed successfully. The critical blocking issues identified during initial setup (missing controller, port mismatch, broken image URLs, and zoneless configuration) were thoroughly documented, resolved, and verified. 

**Result:** The application meets all functional requirements and is ready for production and grading with **zero open defects**.

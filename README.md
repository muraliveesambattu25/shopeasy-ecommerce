# ShopEase - E-Commerce React Application

A fully functional E-Commerce React application with mock data and LocalStorage persistence, designed for comprehensive Selenium WebDriver test automation coverage.

## Tech Stack

- **React 18+** with Vite
- **React Router v6**
- **Context API** (Auth, Cart, Product)
- **LocalStorage** for persistence (no backend)
- **react-icons**, **uuid**

## Project Structure

```
src/
  components/
    Auth/         - Login, Register, ForgotPassword
    Header/       - Navbar, SearchBar, UserMenu, CartIcon
    Products/     - ProductCard, FilterSidebar, SortDropdown
    Cart/         - CartPage content, CartItem, CartSummary
    Checkout/     - ShippingForm, PaymentForm, OrderSummary
    Profile/      - ProfilePage, OrderHistory, Wishlist, AddressBook
    Common/       - Button, Input, Dropdown, Checkbox, RadioButton, Alert, Modal, Loader, Pagination
    Footer/
  context/        - AuthContext, CartContext, ProductContext
  mockData/       - products (100+), users, categories, orders
  utils/          - validation, localStorage, helpers
  pages/          - HomePage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, OrderSuccessPage
```

## Setup

```bash
cd shopeasy-ecommerce
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Test Users (pre-seeded)

| Email             | Password  |
|------------------|-----------|
| test@example.com | Test@123  |
| demo@example.com | Demo@123  |

## Features

- **Auth**: Register, Login, Forgot Password, Remember Me, logout with confirmation
- **Products**: 100+ products, search with autocomplete, filters (category, price, brand, rating, discount), sort, pagination
- **Product Detail**: Gallery, quantity, Add to Cart, Buy Now, wishlist, tabs (Description, Specifications, Reviews), related products
- **Cart**: Quantity controls, coupon codes (SAVE10, FLAT50, NEWUSER), Save for Later, Remove with confirmation
- **Checkout**: Multi-step (Shipping → Payment → Review), saved addresses, payment methods (Card, UPI, Net Banking, COD, Wallet), place order
- **Profile**: Edit profile, profile picture upload, Order History, Wishlist, Address Book
- **Design**: Primary gradient (#667eea, #764ba2), responsive, data-testid attributes throughout for Selenium

## Coupon Codes (mock)

- **SAVE10** - 10% off (max ₹1000)
- **FLAT50** - ₹50 off (min order ₹500)
- **NEWUSER** - 15% off for new users (max ₹500)

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Selenium / data-testid

All interactive elements use consistent `data-testid` attributes (e.g. `btn-add-to-cart`, `input-email`, `cart-item-{productId}`). See the project spec for the full naming convention.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ProfilePage from './components/Profile/ProfilePage';
import OrderHistory from './components/Profile/OrderHistory';
import Wishlist from './components/Profile/Wishlist';
import AddressBook from './components/Profile/AddressBook';

function NotFound() {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <a href="/">Go home</a>
    </div>
  );
}

function AppLayout({ children, hideFooter }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ForgotPassword />} />
                <Route
                  path="/"
                  element={
                    <AppLayout>
                      <HomePage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <AppLayout>
                      <ProductsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/product/:productId"
                  element={
                    <AppLayout>
                      <ProductDetailPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <AppLayout>
                      <CartPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <AppLayout hideFooter>
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    </AppLayout>
                  }
                />
                <Route
                  path="/order-success"
                  element={
                    <AppLayout>
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AppLayout>
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    </AppLayout>
                  }
                >
                  <Route index element={null} />
                  <Route path="orders" element={<OrderHistory />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="addresses" element={<AddressBook />} />
                </Route>
                <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
              </Routes>
            </div>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

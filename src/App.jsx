import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/lib/cart'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store/store'

import { login } from './store/authSlice'
import { trackEvent } from './lib/tracker'

import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { CartPage } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Categories } from './pages/Categories'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminAnalytics } from './pages/admin/AdminAnalytics'
import { AdminCheckouts } from './pages/admin/AdminCheckouts'
import { AdminVisitors } from './pages/admin/AdminVisitors'
import { AdminUsers } from './pages/admin/AdminUsers' // ⚡ NEW IMPORT

function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("loomzo_token");
    const userString = localStorage.getItem("loomzo_user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        dispatch(login({ token, user }));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, [dispatch]);

  return null;
}

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view");
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthHydrator />
        <PageTracker />

        <CartProvider>
          <div className="app-container">
            <Routes>
              {/* PUBLIC STORE ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* PRIVATE ADMIN ROUTES */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="checkouts" element={<AdminCheckouts />} />
                <Route path="visitors" element={<AdminVisitors />} />
                <Route path="users" element={<AdminUsers />} /> {/* ⚡ NEW ROUTE */}
              </Route>
            </Routes>
            <Toaster />
          </div>
        </CartProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
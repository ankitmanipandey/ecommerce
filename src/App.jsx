import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/lib/cart'
import { Provider } from 'react-redux'
import { store } from './store/store'

// ⚡ IMPORT YOUR TRACKER HELPER
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

// ⚡ NEW: The Global Page Tracker Component
function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    // This fires a 'page_view' event every time the URL path changes
    trackEvent("page_view");
  }, [location.pathname]);

  return null; // It renders nothing to the screen
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Drop the tracker right here, inside the BrowserRouter! */}
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

              {/* PRIVATE ADMIN ROUTES (Painted Door Dashboard) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="checkouts" element={<AdminCheckouts />} />
                <Route path="visitors" element={<AdminVisitors />} />
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
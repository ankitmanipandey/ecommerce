import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/lib/cart'
import { Provider } from 'react-redux'
import { store } from '@/store/store'

import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { CartPage } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Categories } from './pages/Categories' // <-- Imported new component

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <CartProvider>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} /> {/* <-- Added new route */}
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <Toaster />
          </div>
        </CartProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
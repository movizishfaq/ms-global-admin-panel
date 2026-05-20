import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { authMe } from './lib/api';
import {
  apiUserToStored,
  getStoredToken,
  setStoredToken,
  type StoredAuthUser
} from './lib/authStorage';
import { captureReferralFromUrl } from './lib/referral';
import { getAppMode, isStudioMode } from './lib/appMode';
import { Header } from './components/Header';
import { CartNotification } from './components/CartNotification';
import { SiteSync } from './components/SiteSync';
import { StudioOwnerGate } from './components/studio/StudioOwnerGate';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { JoinPage } from './pages/JoinPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { PublicBuilderPage } from './pages/PublicBuilderPage';
import { StoreProvider } from './context/StoreContext';
import { SiteThemeRoot } from './components/SiteThemeRoot';
import { AnalyticsTracker } from './components/AnalyticsTracker';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: string;
  image: string;
  quantity: number;
}

export type User = StoredAuthUser;

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  notification: CartItem | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  signIn: (session: { token: string; user: User }) => void;
  signOut: () => void;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  notification: null,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
});

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  signIn: () => {},
  signOut: () => {}
});

export function useCart() {
  return useContext(CartContext);
}

export function useAuth() {
  return useContext(AuthContext);
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
  }
};

function AnimatedRoutes({ mode }: { mode: 'storefront' | 'studio' }) {
  const location = useLocation();

  if (mode === 'studio') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route
              path="/admin"
              element={
                <StudioOwnerGate>
                  <AdminPanelPage />
                </StudioOwnerGate>
              }
            />
            <Route path="/signin" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
          <Route path="/p/:slug" element={<PublicBuilderPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  const mode = getAppMode();
  const studio = isStudioMode();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<CartItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }
    authMe(token)
      .then(({ user: u }) => setUser(apiUserToStored(u)))
      .catch(() => setStoredToken(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, { ...item, quantity: 1 }];
    });
    setNotification({ ...item, quantity: 1 });
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const signIn = (session: { token: string; user: User }) => {
    setStoredToken(session.token);
    setUser(session.user);
  };

  const signOut = () => {
    setStoredToken(null);
    setUser(null);
  };

  return (
    <StoreProvider>
      <AuthContext.Provider
        value={{ user, authLoading, signIn, signOut }}
      >
        <CartContext.Provider
          value={{
            cartItems,
            cartCount: cartItems.reduce((s, i) => s + i.quantity, 0),
            notification,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart: () => setCartItems([])
          }}
        >
          <BrowserRouter>
            <SiteSync />
            {!studio && <AnalyticsTracker />}
            {!studio && <SiteThemeRoot />}
            {!studio && <CartNotification />}
            {!studio && <Header />}
            <main>
              <AnimatedRoutes mode={mode} />
            </main>
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    </StoreProvider>
  );
}

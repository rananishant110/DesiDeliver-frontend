import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import Dashboard from './components/common/Dashboard';
import ProductCatalog from './components/catalog/ProductCatalog';
import CartPage from './components/cart/CartPage';
import OrdersPage from './components/orders/OrdersPage';
import OrderDetail from './components/orders/OrderDetail';
import StaffDashboard from './components/staff/StaffDashboard';
import TicketsPage from './components/tickets/TicketsPage';
import StaffTicketDashboard from './components/tickets/StaffTicketDashboard';
import Layout from './components/common/Layout';
import { LandingPage } from './components/landing';
import { useAuth } from './contexts/AuthContext';
import { Product } from './types';
import './styles/globals.css';
import './styles/animations.css';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  const handleViewProduct = (product: Product) => {
    // TODO: Implement product detail view
    console.log('Viewing product:', product);
  };

  return (
    <Routes>
      {/* Public Routes - Landing Page for unauthenticated users */}
      <Route path="/" element={
        isAuthenticated ? (
          <Layout>
            <Dashboard />
          </Layout>
        ) : (
          <LandingPage />
        )
      } />

      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
      } />
      
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegistrationForm />
      } />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/catalog" element={
        <ProtectedRoute>
          <Layout>
            <ProductCatalog onViewProduct={handleViewProduct} />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/cart" element={
        <ProtectedRoute>
          <Layout>
            <CartPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <Layout>
            <OrderDetail />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout>
            <OrdersPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/tickets/*" element={
        <ProtectedRoute>
          <Layout>
            <TicketsPage />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/staff-tickets" element={
        <ProtectedRoute>
          <Layout>
            <StaffTicketDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/staff" element={
        <ProtectedRoute>
          <Layout>
            <StaffDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <div>Profile Component - Coming Soon!</div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <AppContent />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

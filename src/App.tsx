import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './components/common/Dashboard';
import ProductCatalog from './components/catalog/ProductCatalog';
import CartPage from './components/cart/CartPage';
import OrdersPage from './components/orders/OrdersPage';
import StaffDashboard from './components/staff/StaffDashboard';
import Layout from './components/common/Layout';
import { useAuth } from './contexts/AuthContext';
import { Product } from './types';
import './App.css';

// Create a custom theme for DesiDeliver
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink/Red
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('dashboard');

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

  if (isAuthenticated) {
    const handleNavigate = (route: string) => {
      setCurrentRoute(route);
    };

    // Cart functionality is now handled by CartContext

    const handleViewProduct = (product: Product) => {
      // TODO: Implement product detail view
      console.log('Viewing product:', product);
    };

    const renderContent = () => {
      switch (currentRoute) {
        case 'catalog':
          return <ProductCatalog 
            onViewProduct={handleViewProduct} 
            onBackToDashboard={() => setCurrentRoute('dashboard')}
          />;
        case 'cart':
          return <CartPage 
            onBackToDashboard={() => setCurrentRoute('dashboard')}
            onNavigateToCheckout={() => setCurrentRoute('orders')}
          />;
        case 'orders':
          return <OrdersPage onBackToDashboard={() => setCurrentRoute('dashboard')} />;
        case 'staff':
          return <StaffDashboard onBackToDashboard={() => setCurrentRoute('dashboard')} />;
        case 'profile':
          return <div>Profile Component - Coming Soon!</div>;
        default:
          return <Dashboard onNavigate={handleNavigate} />;
      }
    };

    return (
      <Layout onNavigate={handleNavigate}>
        {renderContent()}
      </Layout>
    );
  }

  return <LoginForm />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

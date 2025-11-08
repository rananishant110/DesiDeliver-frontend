import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { ShoppingBasket, TrendingUp, ArrowBack } from '@mui/icons-material';
import { Product, Category } from '../../types';
import { productsAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import ProductGrid from './ProductGrid';
import CategoryNav from './CategoryNav';
import SearchFilters from './SearchFilters';
import PaginationComponent from './Pagination';

interface ProductCatalogProps {
  onViewProduct: (product: Product) => void;
  onBackToDashboard?: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onViewProduct,
  onBackToDashboard,
}) => {
  const { addToCart } = useCart();
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedStockStatus, setSelectedStockStatus] = useState<boolean | null>(null);
  
  // State for search mode
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const response = await productsAPI.getCategories();
      setCategories(response.results || []);
    } catch (err) {
      setCategoriesError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isSearchMode && searchTerm.trim()) {
        // Use search endpoint
        response = await productsAPI.searchProducts({
          search: searchTerm,
          category: selectedCategory,
          in_stock: selectedStockStatus,
          page: currentPage,
          page_size: pageSize,
        });
      } else {
        // Use regular products endpoint
        response = await productsAPI.getProducts({
          page: currentPage,
          page_size: pageSize,
          category: selectedCategory,
          in_stock: selectedStockStatus,
        });
      }
      
      setProducts(response.results || []);
      setTotalItems(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / pageSize));
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, selectedCategory, selectedStockStatus, isSearchMode]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setIsSearchMode(!!term.trim());
    setCurrentPage(1);
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  }, []);

  // Handle stock filter
  const handleStockFilter = useCallback((inStock: boolean | null) => {
    setSelectedStockStatus(inStock);
    setCurrentPage(1);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedStockStatus(null);
    setIsSearchMode(false);
    setCurrentPage(1);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBackToDashboard}
          sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 2,
          color: 'primary.main'
        }}>
          <ShoppingBasket fontSize="large" />
          Product Catalog
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Browse our extensive collection of Indian groceries and supplies
        </Typography>
      </Box>

      {/* Search and Filters */}
      <SearchFilters
        categories={categories}
        onSearch={handleSearch}
        onCategoryFilter={handleCategorySelect}
        onStockFilter={handleStockFilter}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStockStatus={selectedStockStatus}
      />

      {/* Search Results Summary */}
      {searchTerm && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🔍 Search Results for "{searchTerm}":
            <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
              {loading ? 'Searching...' : `${totalItems} product(s) found`}
            </Box>
          </Typography>
        </Paper>
      )}

      {/* Category Navigation */}
      <CategoryNav
        categories={categories}
        loading={categoriesLoading}
        error={categoriesError}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== null || selectedStockStatus !== null) && (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp />
            Active Filters:
            {searchTerm && (
              <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                Search: "{searchTerm}"
              </Box>
            )}
            {selectedCategory !== null && (
              <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                Category: {categories.find(c => c.id === selectedCategory)?.name}
              </Box>
            )}
            {selectedStockStatus !== null && (
              <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 }}>
                Stock: {selectedStockStatus ? 'In Stock' : 'Out of Stock'}
              </Box>
            )}
          </Typography>
        </Paper>
      )}

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={addToCart}
        onViewProduct={onViewProduct}
      />

      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default ProductCatalog;

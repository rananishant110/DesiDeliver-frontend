import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Alert,
  CircularProgress,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { ShoppingBasket, TrendingUp, ArrowBack, LocalOffer, FilterAlt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product, Category } from '../../types';
import { productsAPI } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import ProductGrid from './ProductGrid';
import CategoryNav from './CategoryNav';
import SearchFilters from './SearchFilters';
import PaginationComponent from './Pagination';

const MotionBox = motion(Box);

interface ProductCatalogProps {
  onViewProduct: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onViewProduct,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
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
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      {/* Modern Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4 }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: 4,
            overflow: 'hidden',
            p: { xs: 3, md: 5 },
            background: `linear-gradient(135deg, ${alpha('#FF6B35', 0.9)} 0%, ${alpha('#F7931E', 0.9)} 100%)`,
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '50%',
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBasket sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  Product Catalog
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Discover authentic Indian groceries and supplies
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 3 }}>
              <Chip
                icon={<LocalOffer sx={{ color: 'white !important' }} />}
                label={`${totalItems} Products`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
              <Chip
                icon={<FilterAlt sx={{ color: 'white !important' }} />}
                label={`${categories.length} Categories`}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Box>
          </Box>
        </Box>
      </MotionBox>

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
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🔍 Search Results for &quot;{searchTerm}&quot;:
            <Chip
              label={loading ? 'Searching...' : `${totalItems} product(s) found`}
              size="small"
              color="info"
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>
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
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <TrendingUp sx={{ color: 'primary.main' }} />
            Active Filters:
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                size="small"
                onDelete={handleClearFilters}
                sx={{ ml: 1 }}
              />
            )}
            {selectedCategory !== null && (
              <Chip
                label={`Category: ${categories.find(c => c.id === selectedCategory)?.name}`}
                size="small"
                onDelete={() => handleCategorySelect(null)}
                sx={{ ml: 1 }}
              />
            )}
            {selectedStockStatus !== null && (
              <Chip
                label={`Stock: ${selectedStockStatus ? 'In Stock' : 'Out of Stock'}`}
                size="small"
                onDelete={() => handleStockFilter(null)}
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
        </Box>
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
          <CircularProgress 
            size={60} 
            sx={{ 
              color: 'primary.main',
            }} 
          />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 3, 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ProductCatalog;

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Grid,
  Skeleton,
  Alert,
} from '@mui/material';
import { AddShoppingCart, Visibility, Inventory } from '@mui/icons-material';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewProduct: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  onAddToCart,
  onViewProduct,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2.5 }}>
        {[...Array(8)].map((_, index) => (
          <Card key={index} sx={{ height: 280 }}>
            <Skeleton variant="rectangular" height={120} />
            <CardContent>
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={80} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width={60} height={20} sx={{ mb: 2 }} />
            </CardContent>
            <CardActions>
              <Skeleton variant="rectangular" width={80} height={36} />
              <Skeleton variant="rectangular" width={80} height={36} />
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria or browse all categories
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2.5 }}>
      {products.map((product) => (
        <Card key={product.id} sx={{ height: 280, display: 'flex', flexDirection: 'column' }}>
          {/* Product Header - Clean & Focused */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontSize: '1rem', 
                fontWeight: 600,
                lineHeight: 1.3,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                height: '2.6rem'
              }}
            >
              {product.name}
            </Typography>
            
            {/* Category Badge - Subtle & Informative */}
            {product.category && (
              <Chip
                label={product.category.name}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ 
                  fontSize: '0.7rem', 
                  height: '20px', 
                  mb: 1,
                  borderColor: 'primary.light',
                  color: 'primary.main',
                  backgroundColor: 'primary.50'
                }}
              />
            )}
          </Box>



          {/* Stock Status - Simple & Clean */}
          <Box sx={{ px: 2, mb: 2 }}>
            <Chip
              icon={<Inventory />}
              label="In Stock"
              color="success"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>

          {/* Action Buttons - Always Visible */}
          <Box sx={{ mt: 'auto', p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<Visibility />}
                onClick={() => onViewProduct(product)}
                sx={{ flex: 1, fontSize: '0.75rem' }}
              >
                View
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddShoppingCart />}
                onClick={() => onAddToCart(product, 1)}
                sx={{ 
                  flex: 1, 
                  fontSize: '0.75rem',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default ProductGrid;

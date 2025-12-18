import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Skeleton,
  Alert,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  AddShoppingCart, 
  Visibility, 
  CheckCircle,
  RemoveCircleOutline,
  LocalOffer,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../../types';

const MotionCard = motion(Card);

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
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: 'repeat(1, 1fr)', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }, 
        gap: 3 
      }}>
        {[...Array(8)].map((_, index) => (
          <Card 
            key={index} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
            }}
          >
            <Skeleton variant="rectangular" height={180} />
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
        }}
      >
        {error}
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 12,
          px: 4,
          borderRadius: 4,
          border: `2px dashed ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <LocalOffer sx={{ fontSize: 40, color: 'primary.main' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          No products found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria or browse all categories
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: 'repeat(1, 1fr)', 
        sm: 'repeat(2, 1fr)', 
        md: 'repeat(3, 1fr)', 
        lg: 'repeat(4, 1fr)' 
      }, 
      gap: 3 
    }}>
      {products.map((product, index) => (
        <MotionCard 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          whileHover={{ y: -8 }}
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              borderColor: 'primary.light',
            },
          }}
          onClick={() => onViewProduct(product)}
        >
          {/* Product Image Placeholder */}
          <Box 
            sx={{ 
              height: 160,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Category Badge */}
            {product.category && (
              <Chip
                label={product.category.name}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: 'white',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            )}
            
            {/* Stock Status */}
            <Chip
              icon={product.stock_quantity && product.stock_quantity > 0 ? <CheckCircle /> : <RemoveCircleOutline />}
              label={product.stock_quantity && product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              size="small"
              color={product.stock_quantity && product.stock_quantity > 0 ? 'success' : 'error'}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-icon': {
                  fontSize: 14,
                },
              }}
            />

            {/* Product Initial */}
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: alpha(theme.palette.primary.main, 0.15),
                fontSize: '4rem',
              }}
            >
              {product.name.charAt(0)}
            </Typography>
          </Box>

          {/* Product Info */}
          <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                lineHeight: 1.4,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.8em',
              }}
            >
              {product.name}
            </Typography>

            {product.description && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                }}
              >
                {product.description}
              </Typography>
            )}

            {/* Unit Info */}
            {product.unit && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: 'text.secondary',
                  mt: 'auto',
                }}
              >
                Unit: {product.unit}
              </Typography>
            )}
          </CardContent>

          {/* Actions */}
          <Box 
            sx={{ 
              p: 2, 
              pt: 0, 
              display: 'flex', 
              gap: 1.5,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<Visibility />}
              onClick={() => onViewProduct(product)}
              sx={{ 
                flex: 1, 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Details
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddShoppingCart />}
              onClick={() => onAddToCart(product, 1)}
              disabled={!product.stock_quantity || product.stock_quantity <= 0}
              sx={{ 
                flex: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                boxShadow: '0 4px 14px rgba(255, 107, 53, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e55a2b 0%, #d9821a 100%)',
                  boxShadow: '0 6px 20px rgba(255, 107, 53, 0.35)',
                },
                '&:disabled': {
                  background: theme.palette.action.disabledBackground,
                  boxShadow: 'none',
                },
              }}
            >
              Add
            </Button>
          </Box>
        </MotionCard>
      ))}
    </Box>
  );
};

export default ProductGrid;

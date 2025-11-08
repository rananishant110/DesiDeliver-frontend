/**
 * Search utility functions for enhanced search functionality
 */

export interface SearchTerm {
  term: string;
  length: number;
  isExact: boolean;
}

export interface SearchResult {
  score: number;
  matchedTerms: string[];
  highlights: string[];
}

/**
 * Parse search query into individual terms
 */
export const parseSearchQuery = (query: string): SearchTerm[] => {
  if (!query || !query.trim()) return [];
  
  return query
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => ({
      term: term.toLowerCase(),
      length: term.length,
      isExact: term.startsWith('"') && term.endsWith('"')
    }));
};

/**
 * Get search statistics
 */
export const getSearchStats = (query: string) => {
  const terms = parseSearchQuery(query);
  return {
    totalTerms: terms.length,
    exactMatches: terms.filter(t => t.isExact).length,
    partialMatches: terms.filter(t => !t.isExact).length,
    shortestTerm: Math.min(...terms.map(t => t.length)),
    longestTerm: Math.max(...terms.map(t => t.length))
  };
};

/**
 * Generate search suggestions based on query
 */
export const generateSearchSuggestions = (query: string, commonTerms: string[] = []): string[] => {
  if (!query || query.length < 2) return [];
  
  const suggestions: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Add common terms that start with the query
  commonTerms.forEach(term => {
    if (term.toLowerCase().startsWith(queryLower) && !suggestions.includes(term)) {
      suggestions.push(term);
    }
  });
  
  // Add variations of the current query
  if (query.length > 2) {
    suggestions.push(`${query} products`);
    suggestions.push(`${query} items`);
    suggestions.push(`${query} orders`);
  }
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
};

/**
 * Highlight search terms in text
 */
export const highlightSearchTerms = (text: string, searchTerms: string[]): string => {
  if (!text || !searchTerms.length) return text;
  
  let highlightedText = text;
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
};

/**
 * Calculate search relevance score
 */
export const calculateSearchScore = (
  text: string, 
  searchTerms: string[], 
  fieldWeight: number = 1.0
): number => {
  if (!text || !searchTerms.length) return 0;
  
  const textLower = text.toLowerCase();
  let score = 0;
  
  searchTerms.forEach(term => {
    const termLower = term.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === termLower) {
      score += 100 * fieldWeight;
    }
    // Starts with gets high score
    else if (textLower.startsWith(termLower)) {
      score += 80 * fieldWeight;
    }
    // Contains gets medium score
    else if (textLower.includes(termLower)) {
      score += 60 * fieldWeight;
    }
    // Partial word match gets lower score
    else if (termLower.length > 2) {
      const words = textLower.split(/\s+/);
      words.forEach(word => {
        if (word.startsWith(termLower) || word.endsWith(termLower)) {
          score += 40 * fieldWeight;
        }
      });
    }
  });
  
  return score;
};

/**
 * Format search query for display
 */
export const formatSearchQuery = (query: string): string => {
  if (!query) return '';
  
  return query
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => `"${term}"`)
    .join(' + ');
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!query || !query.trim()) {
    errors.push('Search query cannot be empty');
  }
  
  if (query && query.trim().length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }
  
  if (query && query.trim().length > 100) {
    errors.push('Search query cannot exceed 100 characters');
  }
  
  // Check for special characters that might cause issues
  const specialChars = /[<>{}[\]\\]/;
  if (query && specialChars.test(query)) {
    errors.push('Search query contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get search field weights for different types of content
 */
export const getSearchFieldWeights = () => ({
  // Product search weights
  product: {
    name: 2.0,
    item_code: 1.8,
    brand: 1.5,
    description: 1.0,
    category: 1.2,
    origin: 1.0
  },
  // Order search weights
  order: {
    order_number: 2.0,
    business_name: 1.8,
    contact_person: 1.5,
    phone_number: 1.3,
    delivery_address: 1.0,
    status: 1.2
  }
});

/**
 * Debounce search input to avoid excessive API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

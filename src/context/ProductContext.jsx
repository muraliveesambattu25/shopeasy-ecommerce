import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { products } from '../mockData/products';
import { categories } from '../mockData/categories';
import { getFilterState, setFilterState } from '../utils/localStorage';

const ProductContext = createContext(null);

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProduct must be used within ProductProvider');
  return ctx;
};

const SORT_OPTIONS = {
  relevance: (a, b) => 0,
  'price-low-to-high': (a, b) => a.price - b.price,
  'price-high-to-low': (a, b) => b.price - a.price,
  'rating-high-to-low': (a, b) => b.rating - a.rating,
  newest: (a, b) => new Date(b.id) - new Date(a.id),
  popularity: (a, b) => b.reviewCount - a.reviewCount,
  'discount-high-to-low': (a, b) => (b.discount || 0) - (a.discount || 0),
  'name-a-to-z': (a, b) => a.name.localeCompare(b.name),
  'name-z-to-a': (a, b) => b.name.localeCompare(a.name),
};

export function ProductProvider({ children }) {
  const [searchQuery, setSearchQueryState] = useState('');
  const [filters, setFiltersState] = useState(() => getFilterState() || {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 200000 },
    rating: null,
    discount: [],
    availability: null,
    featured: false,
    newArrivals: false,
    onSale: false,
  });
  const [sortBy, setSortByState] = useState('relevance');
  const [currentPage, setCurrentPageState] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(12);

  const setSearchQuery = useCallback((q) => {
    setSearchQueryState(q ?? '');
    setCurrentPageState(1);
  }, []);

  const applyFilters = useCallback((newFilters) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPageState(1);
    setFilterState({ ...filters, ...newFilters });
  }, [filters]);

  const clearFilters = useCallback(() => {
    const empty = {
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 200000 },
      rating: null,
      discount: [],
      availability: null,
      featured: false,
      newArrivals: false,
      onSale: false,
    };
    setFiltersState(empty);
    setFilterState(empty);
    setCurrentPageState(1);
  }, []);

  const setSortBy = useCallback((option) => {
    setSortByState(option);
    setCurrentPageState(1);
  }, []);

  const setPage = useCallback((page) => setCurrentPageState(page), []);
  const setItemsPerPage = useCallback((n) => {
    setItemsPerPageState(n);
    setCurrentPageState(1);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.categories?.length) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.brands?.length) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    const { min, max } = filters.priceRange || {};
    if (min != null) result = result.filter((p) => p.price >= min);
    if (max != null) result = result.filter((p) => p.price <= max);
    if (filters.rating != null) {
      result = result.filter((p) => p.rating >= filters.rating);
    }
    if (filters.discount?.length) {
      result = result.filter((p) => filters.discount.some((d) => (p.discount || 0) >= d));
    }
    if (filters.availability === 'in-stock') result = result.filter((p) => p.inStock);
    if (filters.availability === 'out-of-stock') result = result.filter((p) => !p.inStock);
    if (filters.featured) result = result.filter((p) => p.featured);
    if (filters.newArrivals) result = result.filter((p) => p.isNew);
    if (filters.onSale) result = result.filter((p) => (p.discount || 0) > 0);

    const sortFn = SORT_OPTIONS[sortBy] || SORT_OPTIONS.relevance;
    result.sort(sortFn);
    return result;
  }, [products, searchQuery, filters, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const brandsList = useMemo(() => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(), []);

  const getProductById = useCallback((id) => products.find((p) => p.id === id), []);
  const getFeaturedProducts = useCallback(() => products.filter((p) => p.featured).slice(0, 8), []);
  const getRelatedProducts = useCallback((productId, limit = 6) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return [];
    return products
      .filter((p) => p.id !== productId && (p.category === product.category || p.brand === product.brand))
      .slice(0, limit);
  }, []);

  const value = {
    products,
    filteredProducts,
    paginatedProducts,
    categories,
    brands: brandsList,
    searchQuery,
    filters,
    sortBy,
    currentPage,
    itemsPerPage,
    totalPages,
    totalResults: filteredProducts.length,
    setSearchQuery,
    applyFilters,
    clearFilters,
    setSortBy,
    setPage,
    setItemsPerPage,
    getProductById,
    getFeaturedProducts,
    getRelatedProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

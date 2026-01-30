import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import ProductCard from '../components/Products/ProductCard';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortDropdown from '../components/Products/SortDropdown';
import Pagination from '../components/Common/Pagination';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const {
    paginatedProducts,
    totalResults,
    totalPages,
    currentPage,
    itemsPerPage,
    setSearchQuery,
    applyFilters,
    setPage,
    setItemsPerPage,
  } = useProduct();

  useEffect(() => {
    if (search) setSearchQuery(search);
  }, [search, setSearchQuery]);

  useEffect(() => {
    if (category) applyFilters({ categories: [category] });
  }, [category]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
      {search && (
        <div style={{ marginBottom: 16 }}>
          <h2 data-testid="search-results-header" style={{ marginBottom: 4 }}>
            Showing results for &quot;{search}&quot;
          </h2>
          <p data-testid="search-results-count" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {totalResults} {totalResults === 1 ? 'result' : 'results'}
          </p>
        </div>
      )}
      {search && totalResults === 0 && (
        <p data-testid="no-results">No products found for &quot;{search}&quot;</p>
      )}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <aside style={{ flexShrink: 0 }}>
          <FilterSidebar />
        </aside>
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <SortDropdown />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              itemsPerPage={itemsPerPage}
              onPageChange={setPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

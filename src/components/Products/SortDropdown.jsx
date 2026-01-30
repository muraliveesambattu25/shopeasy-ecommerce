import { useProduct } from '../../context/ProductContext';

const OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-to-high', label: 'Price: Low to High' },
  { value: 'price-high-to-low', label: 'Price: High to Low' },
  { value: 'rating-high-to-low', label: 'Rating: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'discount-high-to-low', label: 'Discount: High to Low' },
  { value: 'name-a-to-z', label: 'Name: A to Z' },
  { value: 'name-z-to-a', label: 'Name: Z to A' },
];

export default function SortDropdown() {
  const { sortBy, setSortBy } = useProduct();

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sort by</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        data-testid="select-sort"
        style={{
          padding: '8px 12px',
          border: '1px solid var(--secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          minWidth: 180,
        }}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} data-testid={`sort-option-${opt.value}`}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

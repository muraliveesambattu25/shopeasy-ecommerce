import { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import Checkbox from '../Common/Checkbox';
import { RadioButton } from '../Common/RadioButton';
import Button from '../Common/Button';

export default function FilterSidebar() {
  const { categories, brands, filters, applyFilters, clearFilters } = useProduct();
  const [priceMin, setPriceMin] = useState(filters.priceRange?.min ?? 0);
  const [priceMax, setPriceMax] = useState(filters.priceRange?.max ?? 200000);
  const [brandSearch, setBrandSearch] = useState('');
  const [showMoreBrands, setShowMoreBrands] = useState(false);

  const categoryCounts = {}; // would compute from products
  const brandList = brands.filter((b) => !brandSearch || b.toLowerCase().includes(brandSearch.toLowerCase()));
  const visibleBrands = showMoreBrands ? brandList : brandList.slice(0, 8);

  return (
    <aside
      style={{
        width: '100%',
        maxWidth: 280,
        padding: 16,
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        height: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <strong>Filters</strong>
        <button
          type="button"
          data-testid="btn-clear-all-filters"
          onClick={clearFilters}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.875rem' }}
        >
          Clear All
        </button>
      </div>

      <section data-testid="filter-category" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Categories</strong>
        {categories.map((cat) => (
          <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Checkbox
              checked={filters.categories?.includes(cat.name)}
              onChange={(checked) => {
                const next = checked
                  ? [...(filters.categories || []), cat.name]
                  : (filters.categories || []).filter((c) => c !== cat.name);
                applyFilters({ categories: next });
              }}
              data-testid={`checkbox-category-${cat.name}`}
            />
            <span>{cat.name}</span>
          </label>
        ))}
      </section>

      <section data-testid="filter-price" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Price Range</strong>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            data-testid="input-min-price"
            min={0}
            max={priceMax}
            style={{ width: 80, padding: '8px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)' }}
          />
          <span>-</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            data-testid="input-max-price"
            min={priceMin}
            max={200000}
            style={{ width: 80, padding: '8px', border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)' }}
          />
        </div>
        <Button
          size="small"
          data-testid="btn-apply-price-filter"
          onClick={() => applyFilters({ priceRange: { min: priceMin, max: priceMax } })}
        >
          Apply
        </Button>
      </section>

      <section data-testid="filter-brand" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Brands</strong>
        <input
          type="search"
          value={brandSearch}
          onChange={(e) => setBrandSearch(e.target.value)}
          placeholder="Search brands"
          data-testid="input-search-brand"
          style={{ width: '100%', padding: '8px', marginBottom: 8, border: '1px solid var(--secondary)', borderRadius: 'var(--radius-sm)' }}
        />
        {visibleBrands.map((b) => (
          <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Checkbox
              checked={filters.brands?.includes(b)}
              onChange={(checked) => {
                const next = checked
                  ? [...(filters.brands || []), b]
                  : (filters.brands || []).filter((x) => x !== b);
                applyFilters({ brands: next });
              }}
              data-testid={`checkbox-brand-${b}`}
            />
            <span>{b}</span>
          </label>
        ))}
        {brandList.length > 8 && (
          <button
            type="button"
            data-testid="btn-show-more-brands"
            onClick={() => setShowMoreBrands((s) => !s)}
            style={{ marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.875rem' }}
          >
            {showMoreBrands ? 'Show less' : 'Show more'}
          </button>
        )}
      </section>

      <section data-testid="filter-rating" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Rating</strong>
        {[4, 3, 2, 1].map((r) => (
          <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <RadioButton
              name="rating"
              value={r}
              checked={filters.rating === r}
              onChange={(v) => applyFilters({ rating: Number(v) })}
              label={`${r}★ & above`}
              data-testid={`radio-rating-${r}`}
            />
          </label>
        ))}
      </section>

      <section data-testid="filter-discount" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Discount</strong>
        {[50, 40, 30, 20, 10].map((d) => (
          <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Checkbox
              checked={filters.discount?.includes(d)}
              onChange={(checked) => {
                const next = checked
                  ? [...(filters.discount || []), d]
                  : (filters.discount || []).filter((x) => x !== d);
                applyFilters({ discount: next });
              }}
              data-testid={`checkbox-discount-${d}`}
            />
            <span>{d}% or more</span>
          </label>
        ))}
      </section>

      <section data-testid="filter-availability" style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Availability</strong>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <RadioButton
            name="availability"
            value="in-stock"
            checked={filters.availability === 'in-stock'}
            onChange={(v) => applyFilters({ availability: v })}
            label="In Stock"
            data-testid="radio-availability-in-stock"
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RadioButton
            name="availability"
            value="out-of-stock"
            checked={filters.availability === 'out-of-stock'}
            onChange={(v) => applyFilters({ availability: v })}
            label="Out of Stock"
            data-testid="radio-availability-out-of-stock"
          />
        </label>
      </section>

      <section style={{ marginBottom: 24 }}>
        <strong style={{ display: 'block', marginBottom: 8 }}>Special</strong>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Checkbox
            checked={filters.featured}
            onChange={(v) => applyFilters({ featured: v })}
            label="Featured"
            data-testid="checkbox-featured"
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Checkbox
            checked={filters.newArrivals}
            onChange={(v) => applyFilters({ newArrivals: v })}
            label="New Arrivals"
            data-testid="checkbox-new-arrivals"
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Checkbox
            checked={filters.onSale}
            onChange={(v) => applyFilters({ onSale: v })}
            label="On Sale"
            data-testid="checkbox-on-sale"
          />
        </label>
      </section>

      <Button data-testid="btn-apply-filters" fullWidth onClick={() => {}}>
        Apply Filters
      </Button>
    </aside>
  );
}

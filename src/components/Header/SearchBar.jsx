import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { addRecentSearch, getRecentSearches } from '../../utils/localStorage';
import { debounce } from '../../utils/helpers';

export default function SearchBar() {
  const navigate = useNavigate();
  const { products, setSearchQuery } = useProduct();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const searchProducts = (q) => {
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }
    const lower = q.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand?.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        p.tags?.some((t) => t.includes(lower))
    );
    setSuggestions(matches.slice(0, 10));
  };

  const debouncedSearch = useRef(debounce(searchProducts, 300)).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query.trim());
    setRecent(getRecentSearches());
    setSearchQuery(query.trim());
    setOpen(false);
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const selectSuggestion = (item) => {
    addRecentSearch(item.name || item);
    setSearchQuery(typeof item === 'string' ? item : item.name);
    setOpen(false);
    if (typeof item === 'object' && item.id) {
      navigate(`/product/${item.id}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(typeof item === 'string' ? item : item.name)}`);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: 500, margin: '0 16px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search for products, brands, and more..."
          data-testid="input-search"
          aria-label="Search"
          style={{
            flex: 1,
            padding: '10px 36px 10px 12px',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button type="submit" data-testid="btn-search" aria-label="Search" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          🔍
        </button>
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); }}
            data-testid="btn-clear-search"
            aria-label="Clear"
            style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            ×
          </button>
        )}
      </form>
      {open && (query.length >= 2 || recent.length) && (
        <ul
          data-testid="autocomplete-list"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            padding: 0,
            listStyle: 'none',
            background: 'var(--white)',
            border: '1px solid var(--secondary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            maxHeight: 360,
            overflow: 'auto',
            zIndex: 100,
          }}
        >
          {query.length < 2 && recent.length > 0 && (
            <li style={{ padding: '8px 12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recent Searches</li>
          )}
          {query.length < 2 &&
            recent.slice(0, 5).map((q, i) => (
              <li
                key={i}
                data-testid={`autocomplete-item-${i}`}
                onClick={() => { setQuery(q); setSearchQuery(q); setOpen(false); navigate(`/products?search=${encodeURIComponent(q)}`); }}
                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--secondary)' }}
              >
                {q}
              </li>
            ))}
          {query.length >= 2 && suggestions.map((p, i) => (
            <li
              key={p.id}
              data-testid={`autocomplete-item-${i}`}
              onClick={() => selectSuggestion(p)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid var(--secondary)',
              }}
            >
              <img src={p.images?.[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
              <div>
                <div style={{ fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>₹{p.price?.toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
